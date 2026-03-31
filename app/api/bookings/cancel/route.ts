import { supabase } from '@/lib/supabase';
import {
  sendCancellationEmail,
  sendDoctorCancellationNotification,
} from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bookingId, createdAt, patientEmail, patientName, appointmentDate, appointmentTime } = body;

    if (!bookingId) {
      return new Response(
        JSON.stringify({ error: 'Booking ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate 30-minute cancellation window
    if (createdAt) {
      const now = Date.now();
      const elapsedMinutes = (now - createdAt) / 1000 / 60;
      
      if (elapsedMinutes > 30) {
        return new Response(
          JSON.stringify({ 
            error: 'Cancellation window expired. Only bookings made within the last 30 minutes can be cancelled. Please call 0346-5473998 for assistance.' 
          }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    const { data, error } = await (supabase as any)
      .from('appointments')
      .update({ status: 'cancelled' })
      .eq('id', bookingId);

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to cancel appointment: ' + error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Send cancellation email to patient
    if (patientEmail && patientName) {
      await sendCancellationEmail(
        patientEmail,
        patientName,
        appointmentDate,
        appointmentTime,
        bookingId
      );
    }

    // Send cancellation notification to doctor
    if (process.env.DR_BAIDAR_EMAIL && patientName) {
      await sendDoctorCancellationNotification(
        process.env.DR_BAIDAR_EMAIL,
        patientName,
        appointmentDate,
        appointmentTime,
        bookingId
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Appointment cancelled successfully',
        data,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Cancellation error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
