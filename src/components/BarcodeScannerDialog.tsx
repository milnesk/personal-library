import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, X } from 'lucide-react';
import { BrowserMultiFormatReader, IScannerControls } from '@zxing/browser';
import { BarcodeFormat, DecodeHintType } from '@zxing/library';
import { toast } from 'sonner';

interface BarcodeScannerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDetected: (isbn: string) => void;
}

function isValidIsbn13(value: string): boolean {
  if (!/^\d{13}$/.test(value)) return false;
  if (!(value.startsWith('978') || value.startsWith('979'))) return false;
  // Checksum
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const d = parseInt(value[i], 10);
    sum += i % 2 === 0 ? d : d * 3;
  }
  const check = (10 - (sum % 10)) % 10;
  return check === parseInt(value[12], 10);
}

export function BarcodeScannerDialog({ open, onOpenChange, onDetected }: BarcodeScannerDialogProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const [status, setStatus] = useState<'starting' | 'scanning' | 'error'>('starting');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    setStatus('starting');
    setErrorMsg('');

    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.EAN_13]);
    hints.set(DecodeHintType.TRY_HARDER, true);
    const reader = new BrowserMultiFormatReader(hints);

    const cleanup = () => {
      controlsRef.current?.stop();
      controlsRef.current = null;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };

    (async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error('Camera not supported in this browser');
        }

        // Manually request the stream so we control play() — iOS Firefox/Safari
        // sometimes hang if a library calls play() before the element is ready.
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;

        const video = videoRef.current;
        if (!video) throw new Error('Video element not ready');

        // Required on iOS to allow inline autoplay.
        video.setAttribute('playsinline', 'true');
        video.setAttribute('webkit-playsinline', 'true');
        video.muted = true;
        video.srcObject = stream;

        try {
          await video.play();
        } catch {
          // Some browsers reject play() but still start the stream; ignore.
        }

        if (cancelled) return;
        setStatus('scanning');

        const controls = reader.decodeFromVideoElement(video, (result) => {
          if (cancelled) return;
          if (result) {
            const text = result.getText();
            if (isValidIsbn13(text)) {
              cleanup();
              onDetected(text);
              onOpenChange(false);
            }
          }
        });
        controlsRef.current = await controls;
      } catch (e: any) {
        if (cancelled) return;
        const name = e?.name || '';
        let msg = e?.message || 'Could not start camera';
        if (name === 'NotAllowedError') msg = 'Camera permission denied. Enable it in your browser settings and try again.';
        else if (name === 'NotFoundError') msg = 'No camera found on this device.';
        else if (name === 'NotReadableError') msg = 'Camera is in use by another app. Close it and try again.';
        setErrorMsg(msg);
        setStatus('error');
        toast.error(msg);
      }
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [open, onDetected, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-2">
          <DialogTitle className="font-display">Scan ISBN Barcode</DialogTitle>
          <DialogDescription>
            Point your camera at the barcode on the back of the book.
          </DialogDescription>
        </DialogHeader>
        <div className="relative bg-black aspect-[3/4] w-full">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
            autoPlay
          />
          {/* Framing guide */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="w-3/4 h-1/3 border-2 border-white/80 rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
          </div>
          {status === 'starting' && (
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Starting camera...
            </div>
          )}
          {status === 'error' && (
            <div className="absolute inset-0 flex items-center justify-center text-white text-center p-6 bg-black/70">
              {errorMsg}
            </div>
          )}
        </div>
        <div className="p-4 flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="gap-1.5">
            <X className="w-4 h-4" /> Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
