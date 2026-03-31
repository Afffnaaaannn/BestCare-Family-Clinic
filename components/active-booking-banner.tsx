'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/primitives';
import { Card, CardContent } from '@/components/ui/primitives';
import { Loader2, AlertCircle, CheckCircle2, X, AlertTriangle } from 'lucide-react';

interface ActiveBooking {
  bookingId: string;
  createdAt: number;
  fullName: string;
  email: string;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  cancelledAt?: number;
}

export function ActiveBookingBanner({ onDismiss }: { onDismiss?: () => void }) {
  const [booking, setBooking] = useState<ActiveBooking | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [canCancel, setCanCancel] = useState(true);
  const [cancellationDeadline, setCancellationDeadline] = useState<string>('');
  const [cancelling, setCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [error, setError] = useState('');
  const [cancelSuccess, setCancelSuccess] = useState(false);

  useEffect(() => {
    const storedBooking = localStorage.getItem('activeBooking');
    const storedCancelledBooking = localStorage.getItem('cancelledBooking');
    const isDismissedStored = localStorage.getItem('bookingBannerDismissed') === 'true';
    const isCancelledDismissedStored = localStorage.getItem('cancelledBookingDismissed') === 'true';
    
    const bookingToUse = storedBooking || storedCancelledBooking;
    const isCancelledBooking = !storedBooking && !!storedCancelledBooking;
    
    if (bookingToUse) {
      try {
        const bookingData = JSON.parse(bookingToUse);
        setBooking(bookingData);
        setIsCancelled(isCancelledBooking);
        
        if (!isCancelledBooking) {
          const now = Date.now();
          const bookingAgeMinutes = (now - bookingData.createdAt) / 1000 / 60;
          const shouldShowForRecentBooking = bookingAgeMinutes < 120;
          
          setIsDismissed(isDismissedStored && !shouldShowForRecentBooking);
        } else {
          setIsDismissed(isCancelledDismissedStored);
        }
      } catch (err) {
        console.error('Failed to parse booking data:', err);
      }
    }

    const handleBannerRestore = () => {
      setIsDismissed(false);
      localStorage.removeItem('cancelledBookingDismissed');
    };

    window.addEventListener('bookingBannerRestore', handleBannerRestore);
    return () => window.removeEventListener('bookingBannerRestore', handleBannerRestore);
  }, []);

  useEffect(() => {
    if (!booking) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedMinutes = (now - booking.createdAt) / 1000 / 60;
      const canCancelWindow = elapsedMinutes < 30;
      
      setCanCancel(canCancelWindow);

      if (canCancelWindow) {
        const deadlineTime = new Date(booking.createdAt + 30 * 60 * 1000);
        setCancellationDeadline(deadlineTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [booking]);

  const handleCancel = async () => {
    if (!booking) return;
    
    // Verify email before cancelling
    if (verificationEmail.toLowerCase() !== booking.email.toLowerCase()) {
      setVerificationError('Email does not match. Please check and try again.');
      return;
    }
    
    setCancelling(true);
    setError('');
    setVerificationError('');

    try {
      const response = await fetch('/api/bookings/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: booking.bookingId,
          createdAt: booking.createdAt,
          patientEmail: booking.email,
          patientName: booking.fullName,
          appointmentDate: booking.appointmentDate,
          appointmentTime: booking.appointmentTime,
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to cancel appointment';
        
        try {
          const data = await response.json();
          errorMessage = data.error || errorMessage;
        } catch {
          const text = await response.text();
          if (text.includes('SSL') || text.includes('525') || text.includes('DOCTYPE')) {
            errorMessage = 'SERVICE_UNAVAILABLE';
          }
        }
        
        throw new Error(errorMessage);
      }

      setCancelSuccess(true);
      const cancelledData = { ...booking, cancelledAt: Date.now() };
      localStorage.setItem('cancelledBooking', JSON.stringify(cancelledData));
      localStorage.removeItem('activeBooking');
      localStorage.removeItem('bookingBannerDismissed');
      setBooking(cancelledData);
      setShowCancelConfirm(false);
      setVerificationEmail('');
      setIsDismissed(false);
      
      setTimeout(() => {
        setCancelSuccess(false);
      }, 5000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to cancel appointment';
      setError(errorMsg);
      setShowCancelConfirm(false);
    } finally {
      setCancelling(false);
    }
  };

  if (!booking) return null;

  if (isDismissed) {
    return null;
  }

  if (cancelSuccess) {
    return (
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-orange-900">Appointment Cancelled</h3>
            <p className="text-sm text-orange-800 mt-1">Your appointment has been successfully cancelled. A confirmation email has been sent.</p>
          </div>
        </div>
      </div>
    );
  }

  if (isCancelled) {
    const cancelledTime = booking?.cancelledAt 
      ? new Date(booking.cancelledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '';
    const cancelledDate = booking?.cancelledAt
      ? new Date(booking.cancelledAt).toLocaleDateString()
      : '';

    return (
      <Card className="border-red-300 bg-red-50 mb-6">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 flex items-center gap-2">
                📅 Cancelled Appointment
              </h3>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-red-800"><strong>Patient:</strong> {booking.fullName}</p>
                <p className="text-sm text-red-800"><strong>Scheduled Date & Time:</strong> {booking.appointmentDate} at {booking.appointmentTime}</p>
                <p className="text-sm text-red-800"><strong>Reason:</strong> {booking.reason}</p>
                <p className="text-sm text-red-800"><strong>Doctor:</strong> Dr. Baidar Hussain</p>
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-xs text-red-700 bg-red-100 border border-red-400 rounded p-2">
                  ❌ This appointment has been cancelled
                </p>
                <p className="text-xs text-red-700 bg-red-100 border border-red-400 rounded p-2">
                  ⏰ Cancelled on {cancelledDate} at {cancelledTime}
                </p>
              </div>
            </div>
            <Button
              onClick={() => {
                localStorage.setItem('cancelledBookingDismissed', 'true');
                setIsDismissed(true);
              }}
              variant="outline"
              size="icon"
              className="text-red-600 hover:text-red-800"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 bg-blue-50 mb-6">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 flex items-center gap-2">
              📅 Active Appointment
            </h3>
            <div className="mt-4 space-y-2">
              <p className="text-sm"><strong>Patient:</strong> {booking.fullName}</p>
              <p className="text-sm"><strong>Date & Time:</strong> {booking.appointmentDate} at {booking.appointmentTime}</p>
              <p className="text-sm"><strong>Reason:</strong> {booking.reason}</p>
              <p className="text-sm"><strong>Doctor:</strong> Dr. Baidar Hussain</p>
            </div>

            {canCancel ? (
              <div className="mt-4">
                <p className="text-xs text-blue-700 bg-blue-100 border border-blue-300 rounded p-2 mb-3">
                  ⏱️ Cancellation available until {cancellationDeadline}
                </p>
                {!showCancelConfirm ? (
                  <Button
                    onClick={() => setShowCancelConfirm(true)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    Cancel Appointment
                  </Button>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded p-3 space-y-3">
                    <p className="text-xs text-red-700"><strong>Confirm Cancellation?</strong></p>
                    <p className="text-xs text-red-600">
                      You are about to cancel your appointment on <strong>{booking.appointmentDate}</strong> at <strong>{booking.appointmentTime}</strong>.
                    </p>
                    
                    <div className="bg-white border border-red-300 rounded p-2">
                      <label className="text-xs font-semibold text-gray-700">
                        Verify Email to Cancel:
                      </label>
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={verificationEmail}
                        onChange={(e) => {
                          setVerificationEmail(e.target.value);
                          setVerificationError('');
                        }}
                        className="w-full mt-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                      {verificationError && (
                        <p className="text-xs text-red-600 mt-1">{verificationError}</p>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={handleCancel}
                        disabled={cancelling}
                        size="sm"
                        variant="destructive"
                        className="flex-1"
                      >
                        {cancelling ? (
                          <>
                            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                            Cancelling...
                          </>
                        ) : (
                          'Yes, Cancel Appointment'
                        )}
                      </Button>
                      <Button
                        onClick={() => setShowCancelConfirm(false)}
                        disabled={cancelling}
                        size="sm"
                        variant="outline"
                      >
                        No, Keep It
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-4 bg-red-50 border border-red-200 rounded p-3">
                <p className="text-xs text-red-700 flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> <strong>Cancellation window expired</strong></p>
                <p className="text-xs text-red-600 mt-1">Cancellations are only available within 30 minutes of booking. Please call us at <strong>0346-5473998</strong> for assistance.</p>
              </div>
            )}

            {error && (
              error === 'SERVICE_UNAVAILABLE' ? (
                <div className="mt-3 bg-red-50 border border-red-300 rounded p-3 space-y-2">
                  <p className="text-xs text-red-800 flex items-start gap-2"><AlertCircle className="h-4 w-4 shrink-0 mt-0.5" /> <strong>Cancellation Service Temporarily Unavailable</strong></p>
                  <p className="text-xs text-red-700 ml-6">Our online cancellation system is experiencing temporary issues. Please try again shortly or call us at <strong>0346-5473998</strong> to cancel over the phone.</p>
                  <Button
                    onClick={() => setError('')}
                    size="sm"
                    variant="outline"
                    className="mt-2 border-red-300 hover:bg-red-100"
                  >
                    Try Again
                  </Button>
                </div>
              ) : (
                <div className="mt-3 bg-red-50 border border-red-200 rounded p-3 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700">{error}</p>
                </div>
              )
            )}
          </div>
          
          <Button
            onClick={() => {
              localStorage.setItem('bookingBannerDismissed', 'true');
              setIsDismissed(true);
              onDismiss?.();
            }}
            variant="ghost"
            size="sm"
            className="shrink-0"
            title="Dismiss banner (appointment data saved)"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function useActiveBooking() {
  const [booking, setBooking] = useState<ActiveBooking | null>(null);
  
  useEffect(() => {
    const storedBooking = localStorage.getItem('activeBooking');
    if (storedBooking) {
      try {
        setBooking(JSON.parse(storedBooking));
      } catch (err) {
        console.error('Failed to parse booking:', err);
      }
    }
  }, []);
  
  return {
    booking,
    hasActiveBooking: !!booking,
    restoreBookingBanner: () => {
      localStorage.removeItem('bookingBannerDismissed');
    },
    clearBooking: () => {
      localStorage.removeItem('activeBooking');
      localStorage.removeItem('bookingBannerDismissed');
      setBooking(null);
    }
  };
}
