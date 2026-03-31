import { supabase } from '@/lib/supabase';
import {
  sendBookingConfirmation,
  sendDoctorNotification,
} from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      fullName,
      email,
      phone,
      appointmentDate,
      appointmentTime,
      reason,
      notes,
    } = body;

    if (!fullName || !email || !phone || !appointmentDate || !appointmentTime || !reason) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { data, error } = await (supabase as any)
      .from('appointments')
      .insert([
        {
          patient_id: null,
          appointment_date: appointmentDate,
          appointment_time: appointmentTime,
          doctor_name: 'Dr. Baidar Hussain',
          reason: reason,
          notes: `Guest Booking\nName: ${fullName}\nEmail: ${email}\nPhone: ${phone}\n\n${notes || 'No additional notes'}`,
          status: 'scheduled',
        },
      ]).select();

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to book appointment: ' + error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const bookingId = data && data[0] ? data[0].id : `APT-${Date.now()}`;

    console.log('✅ Booking created:', bookingId);
    console.log('📧 RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
    console.log('📧 Sending confirmation to:', email);

    const confirmationResult = await sendBookingConfirmation(
      email,
      fullName,
      appointmentDate,
      appointmentTime,
      reason,
      bookingId
    );
    console.log('✅ Confirmation email result:', confirmationResult);

    // Send notification email to doctor
    if (process.env.DR_BAIDAR_EMAIL) {
      console.log('📧 Sending doctor notification to:', process.env.DR_BAIDAR_EMAIL);
      const doctorResult = await sendDoctorNotification(
        process.env.DR_BAIDAR_EMAIL,
        fullName,
        email,
        phone,
        appointmentDate,
        appointmentTime,
        reason,
        notes,
        bookingId
      );
      console.log('✅ Doctor notification result:', doctorResult);
    } else {
      console.log('⚠️ DR_BAIDAR_EMAIL not set');
    }

    // TODO: Send WhatsApp notification to Dr. Baidar

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Appointment booked successfully',
        bookingId,
        data,
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Booking error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
