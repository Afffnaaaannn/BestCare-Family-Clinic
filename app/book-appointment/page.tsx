'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/primitives';
import { Input } from '@/components/ui/primitives';
import { Label } from '@/components/ui/primitives';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/primitives';
import { Alert, AlertDescription } from '@/components/ui/primitives';
import { Textarea } from '@/components/ui/forms';
import { ArrowLeft, Loader2, CheckCircle2, AlertCircle, Calendar, Clock, User, Phone, Mail } from 'lucide-react';

export default function BookAppointmentPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [bookingCreatedAt, setBookingCreatedAt] = useState<number | null>(null);
  const [canCancelBooking, setCanCancelBooking] = useState(true);
  const [cancellationDeadline, setCancellationDeadline] = useState<string>('');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancellationSuccess, setCancellationSuccess] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [bookingDetails, setBookingDetails] = useState({
    fullName: '',
    email: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
  });
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
    notes: '',
  });

  useEffect(() => {
    if (!bookingCreatedAt) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedMinutes = (now - bookingCreatedAt) / 1000 / 60;
      const canCancel = elapsedMinutes < 30;
      
      setCanCancelBooking(canCancel);

      if (canCancel) {
        const deadlineTime = new Date(bookingCreatedAt + 30 * 60 * 1000);
        setCancellationDeadline(deadlineTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [bookingCreatedAt]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'appointmentTime' && value) {
      const [hours, minutes] = value.split(':').map(Number);
      if (hours < 18 || (hours === 21 && minutes > 0) || hours > 21) {
        setError('Clinic hours are 6:00 PM to 9:00 PM. For morning appointments, please call 0346-5473998');
      } else {
        setError('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.fullName || !formData.email || !formData.phone || !formData.appointmentDate || !formData.appointmentTime || !formData.reason) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (formData.phone.length < 10) {
      setError('Please enter a valid phone number');
      setLoading(false);
      return;
    }

    const [hours, minutes] = formData.appointmentTime.split(':').map(Number);
    if (hours < 18 || (hours === 21 && minutes > 0) || hours > 21) {
      setError('Clinic hours are 6:00 PM to 9:00 PM. For morning appointments, please call 0346-5473998');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to book appointment';
        
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

      const responseData = await response.json();
      setBookingId(responseData.bookingId || '');
      setBookingCreatedAt(Date.now());
      
      const bookingData = {
        bookingId: responseData.bookingId || '',
        createdAt: Date.now(),
        fullName: formData.fullName,
        email: formData.email,
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        reason: formData.reason,
      };
      
      localStorage.setItem('activeBooking', JSON.stringify(bookingData));
      localStorage.removeItem('bookingBannerDismissed');
      
      setBookingDetails({
        fullName: formData.fullName,
        email: formData.email,
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        reason: formData.reason,
      });
      
      setSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        appointmentDate: '',
        appointmentTime: '',
        reason: '',
        notes: '',
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to book appointment';
      
      if (errorMsg === 'SERVICE_UNAVAILABLE') {
        setError('SERVICE_UNAVAILABLE');
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!bookingId) return;
    
    // Verify email before cancelling
    if (verificationEmail.toLowerCase() !== bookingDetails.email.toLowerCase()) {
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
          bookingId,
          createdAt: bookingCreatedAt,
          patientEmail: bookingDetails.email,
          patientName: bookingDetails.fullName,
          appointmentDate: bookingDetails.appointmentDate,
          appointmentTime: bookingDetails.appointmentTime,
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

      setCancellationSuccess(true);
      setSuccess(false);
      setBookingId('');
      setBookingCreatedAt(null);
      setCanCancelBooking(true);
      setCancellationDeadline('');
      setShowCancelConfirm(false);
      setVerificationEmail('');
      localStorage.removeItem('activeBooking');
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        appointmentDate: '',
        appointmentTime: '',
        reason: '',
        notes: '',
      });
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel appointment');
      setShowCancelConfirm(false);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 pt-20 pb-12">
      <div className="container max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">Book an Appointment</h1>
          <p className="text-muted-foreground">Schedule a visit with Bestcare Family Clinic. No account needed!</p>
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-900"><strong>Clinic Hours:</strong> 6:00 PM - 9:00 PM (Monday - Saturday)</p>
            <p className="text-sm text-amber-800 mt-2">For morning appointments or emergencies, please call <strong>0346-5473998</strong></p>
          </div>
        </div>

        {cancellationSuccess ? (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-8">
              <div className="text-center">
                <CheckCircle2 className="h-16 w-16 text-orange-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Appointment Cancelled Successfully!</h2>
                <p className="text-muted-foreground mb-6">
                  Your appointment has been cancelled. The cancellation has been sent to Dr. Baidar.
                </p>
                
                <div className="bg-white border border-orange-200 rounded-lg p-4 mb-6 text-left">
                  <p className="text-sm text-muted-foreground mb-2"><strong>Cancelled Appointment:</strong></p>
                  <p className="text-sm">Date & Time: {bookingDetails.appointmentDate} at {bookingDetails.appointmentTime}</p>
                  <p className="text-sm">Doctor: Dr. Baidar Hussain</p>
                  <p className="text-sm">Reason: {bookingDetails.reason}</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-900"><strong>Need to Rebook?</strong></p>
                  <p className="text-sm text-blue-800 mt-1">You can book another appointment anytime. Our clinic hours are 6:00 PM - 9:00 PM (Monday - Saturday).</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={() => { setCancellationSuccess(false); window.location.href = '/book-appointment'; }} variant="default">
                    Book Another Appointment
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/">Back to Home</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : success ? (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-8">
              <div className="text-center">
                <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Appointment Booked Successfully!</h2>
                <p className="text-muted-foreground mb-4">
                  We've received your appointment request. Your booking has been sent to Dr. Baidar.
                </p>
                
                {bookingId && (
                  <div className="bg-white border border-green-200 rounded-lg p-4 mb-6 text-left">
                    <p className="text-sm text-muted-foreground mb-1">Booking Reference</p>
                    <p className="font-mono font-bold text-lg text-green-700">{bookingId.slice(0, 8).toUpperCase()}</p>
                    <p className="text-xs text-muted-foreground mt-2">Save this reference for your records</p>
                  </div>
                )}
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm"><strong>Date & Time:</strong> {bookingDetails.appointmentDate} at {bookingDetails.appointmentTime}</p>
                  <p className="text-sm"><strong>Doctor:</strong> Dr. Baidar Hussain</p>
                  <p className="text-sm"><strong>Reason:</strong> {bookingDetails.reason}</p>
                </div>
                
                <p className="text-sm bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <strong>Documents:</strong> Please bring along your documents (medical records, lab results, prescriptions) to the clinic when you come for your appointment.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
                  <Button asChild variant="outline">
                    <Link href="/">Back to Home</Link>
                  </Button>
                </div>
                
                <div className="border-t pt-4">
                  <p className="text-xs text-muted-foreground mb-2">Need to cancel?</p>
                  {canCancelBooking ? (
                    <>
                      <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2 mb-3">
                        ⏱️ Cancellation available until {cancellationDeadline}
                      </p>
                      {!showCancelConfirm ? (
                        <Button
                          onClick={() => setShowCancelConfirm(true)}
                          disabled={cancelling}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Cancel Appointment
                        </Button>
                      ) : (
                        <div className="bg-red-50 border border-red-200 rounded p-3 space-y-3">
                          <p className="text-xs text-red-700"><strong>Confirm Cancellation?</strong></p>
                          <p className="text-xs text-red-600">
                            You are about to cancel your appointment on <strong>{bookingDetails.appointmentDate}</strong> at <strong>{bookingDetails.appointmentTime}</strong>. This action cannot be undone after the 30-minute window closes.
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
                              disabled={cancelling || !verificationEmail}
                              size="sm"
                              variant="destructive"
                              className="flex-1"
                            >
                              {cancelling ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Cancelling...
                                </>
                              ) : (
                                'Yes, Cancel Appointment'
                              )}
                            </Button>
                            <Button
                              onClick={() => {
                                setShowCancelConfirm(false);
                                setVerificationEmail('');
                                setVerificationError('');
                              }}
                              disabled={cancelling}
                              size="sm"
                              variant="outline"
                            >
                              No, Keep Appointment
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="bg-red-50 border border-red-200 rounded p-3">
                      <p className="text-xs text-red-700"><strong>Cancellation window expired</strong></p>
                      <p className="text-xs text-red-600 mt-1">Cancellations are only available within 30 minutes of booking. Please call us at <strong>0346-5473998</strong> for assistance.</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Fill in Your Details</CardTitle>
              <CardDescription>Complete the form below to request an appointment</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  error === 'SERVICE_UNAVAILABLE' ? (
                    <Alert variant="destructive" className="border-red-300 bg-red-50">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      <AlertDescription className="ml-2">
                        <div className="space-y-3">
                          <p className="font-semibold text-red-800">Appointment Service Temporarily Unavailable</p>
                          <p className="text-sm text-red-700">Our online booking system is experiencing temporary connectivity issues. We are working to restore service.</p>
                          <div className="space-y-2 text-sm text-red-700 mt-3">
                            <p><strong>What you can do:</strong></p>
                            <ul className="ml-4 space-y-1">
                              <li>• Try booking again in a few moments</li>
                              <li>• <strong>Call us directly at 0346-5473998</strong> to book over the phone</li>
                            </ul>
                          </div>
                          <Button
                            onClick={() => {
                              setError('');
                              window.location.reload();
                            }}
                            size="sm"
                            variant="outline"
                            className="mt-3 w-full border-red-300 hover:bg-red-100"
                          >
                            Try Again
                          </Button>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert variant={error.includes('successfully') ? 'default' : 'destructive'}>
                      {error.includes('successfully') ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )
                )}

                {/* Personal Information */}
                <div className="space-y-4 pb-4 border-b">
                  <h3 className="font-semibold flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Your Information
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                    <p className="text-xs text-muted-foreground">We'll send your confirmation here</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="0300-1234567"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                {/* Appointment Details */}
                <div className="space-y-4 pb-4 border-b">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Appointment Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="appointmentDate">Preferred Date *</Label>
                      <Input
                        id="appointmentDate"
                        name="appointmentDate"
                        type="date"
                        value={formData.appointmentDate}
                        onChange={handleChange}
                        disabled={loading}
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="appointmentTime">Preferred Time (6:00 PM - 9:00 PM) *</Label>
                      <select
                        id="appointmentTime"
                        name="appointmentTime"
                        value={formData.appointmentTime}
                        onChange={handleChange}
                        disabled={loading}
                        required
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select a time</option>
                        <option value="18:00">6:00 PM</option>
                        <option value="18:30">6:30 PM</option>
                        <option value="19:00">7:00 PM</option>
                        <option value="19:30">7:30 PM</option>
                        <option value="20:00">8:00 PM</option>
                        <option value="20:30">8:30 PM</option>
                        <option value="21:00">9:00 PM</option>
                      </select>
                      <p className="text-xs text-muted-foreground">Available times: 6:00 PM to 9:00 PM. For morning appointments, please call 0346-5473998</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason for Visit *</Label>
                    <select
                      id="reason"
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                      disabled={loading}
                      required
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select a reason</option>
                      <option value="General Checkup">General Checkup</option>
                      <option value="Follow-up">Follow-up</option>
                      <option value="Vaccination">Vaccination</option>
                      <option value="Consultation">Consultation</option>
                      <option value="Sick Visit">Sick Visit</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      placeholder="Please share any additional information that might be helpful..."
                      value={formData.notes}
                      onChange={handleChange}
                      disabled={loading}
                      className="min-h-25"
                    />
                  </div>
                </div>

                {/* Info Section */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-900"><strong>📞 Morning or Emergency Appointments?</strong></p>
                  <p className="text-sm text-blue-800 mt-1">Please call us at <strong>0346-5473998</strong> to schedule morning appointments or handle emergencies.</p>
                </div>

                {/* Cancellation Policy */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-amber-900"><strong>⏱️ Cancellation Policy</strong></p>
                  <p className="text-sm text-amber-800 mt-1">You can cancel your appointment <strong>within 30 minutes</strong> of booking. After 30 minutes, please contact us at <strong>0346-5473998</strong> to cancel.</p>
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full" disabled={loading} size="lg">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Booking Appointment...
                    </>
                  ) : (
                    'Book Appointment'
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Have medical documents? Bring them along when you visit the clinic.
                </p>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
