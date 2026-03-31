'use server';

import { Resend } from 'resend';

let resend: InstanceType<typeof Resend> | null = null;

try {
  if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
} catch (error) {
  console.error('Failed to initialize Resend:', error);
}

export async function sendBookingConfirmation(
  patientEmail: string,
  patientName: string,
  appointmentDate: string,
  appointmentTime: string,
  reason: string,
  bookingId: string
) {
  try {
    if (!resend) {
      console.warn('Resend not initialized, skipping email');
      return { success: false, error: 'Email service not configured' };
    }

    const response = await resend.emails.send({
      from: 'Bestcare Clinic <onboarding@resend.dev>',
      to: patientEmail,
      subject: 'Appointment Booking Confirmation - Bestcare Clinic',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">Appointment Booking Confirmed!</h2>
          <p>Dear ${patientName},</p>
          <p>Thank you for booking an appointment with Bestcare Family Clinic. Here are your booking details:</p>
          
          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Date:</strong> ${appointmentDate}</p>
            <p><strong>Time:</strong> ${appointmentTime}</p>
            <p><strong>Doctor:</strong> Dr. Baidar Hussain</p>
            <p><strong>Reason:</strong> ${reason}</p>
            <p><strong>Booking Reference:</strong> ${bookingId.slice(0, 8).toUpperCase()}</p>
          </div>
          
          <p><strong>Your booking has been confirmed!</strong></p>
          <p>In case of any sudden delays or cancellation, you will be informed promptly via email and phone.</p>
          
          <p style="color: #059669; font-weight: bold;">Please bring your documents:</p>
          <p>Bring along your medical records, lab results, prescriptions, and any other relevant documents when you come for your appointment.</p>
          
          <p>Best regards,<br/>Bestcare Family Clinic</p>
        </div>
      `,
    });

    return { success: true, data: response };
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return { success: false, error };
  }
}

export async function sendDoctorNotification(
  doctorEmail: string,
  patientName: string,
  patientEmail: string,
  patientPhone: string,
  appointmentDate: string,
  appointmentTime: string,
  reason: string,
  notes: string,
  bookingId: string
) {
  try {
    if (!resend) {
      console.warn('Resend not initialized, skipping email');
      return { success: false, error: 'Email service not configured' };
    }

    const response = await resend.emails.send({
      from: 'Bestcare Clinic <onboarding@resend.dev>',
      to: doctorEmail,
      subject: 'New Appointment Booking - Bestcare Clinic',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">New Appointment Booking</h2>
          <p>Dr. Baidar Hussain,</p>
          <p>A new appointment has been booked in your schedule.</p>
          
          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Patient Details</h3>
            <p><strong>Name:</strong> ${patientName}</p>
            <p><strong>Email:</strong> ${patientEmail}</p>
            <p><strong>Phone:</strong> ${patientPhone}</p>
            
            <h3 style="margin-top: 15px;">Appointment Details</h3>
            <p><strong>Date:</strong> ${appointmentDate}</p>
            <p><strong>Time:</strong> ${appointmentTime}</p>
            <p><strong>Reason:</strong> ${reason}</p>
            <p><strong>Notes:</strong> ${notes || 'None'}</p>
            <p><strong>Booking Reference:</strong> ${bookingId.slice(0, 8).toUpperCase()}</p>
          </div>
          
          <p>Please confirm this appointment and contact the patient if needed.</p>
          
          <p>Best regards,<br/>Bestcare Clinic System</p>
        </div>
      `,
    });

    return { success: true, data: response };
  } catch (error) {
    console.error('Error sending doctor notification:', error);
    return { success: false, error };
  }
}

export async function sendCancellationEmail(
  patientEmail: string,
  patientName: string,
  appointmentDate: string,
  appointmentTime: string,
  bookingId: string
) {
  try {
    if (!resend) {
      console.warn('Resend not initialized, skipping email');
      return { success: false, error: 'Email service not configured' };
    }

    const response = await resend.emails.send({
      from: 'Bestcare Clinic <onboarding@resend.dev>',
      to: patientEmail,
      subject: 'Appointment Cancelled - Bestcare Clinic',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Appointment Cancelled</h2>
          <p>Dear ${patientName},</p>
          <p>Your appointment has been successfully cancelled.</p>
          
          <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Date:</strong> ${appointmentDate}</p>
            <p><strong>Time:</strong> ${appointmentTime}</p>
            <p><strong>Booking Reference:</strong> ${bookingId.slice(0, 8).toUpperCase()}</p>
          </div>
          
          <p>If you need to reschedule, please book a new appointment through our website.</p>
          
          <p>Thank you,<br/>Bestcare Family Clinic</p>
        </div>
      `,
    });

    return { success: true, data: response };
  } catch (error) {
    console.error('Error sending cancellation email:', error);
    return { success: false, error };
  }
}

export async function sendDoctorCancellationNotification(
  doctorEmail: string,
  patientName: string,
  appointmentDate: string,
  appointmentTime: string,
  bookingId: string
) {
  try {
    if (!resend) {
      console.warn('Resend not initialized, skipping email');
      return { success: false, error: 'Email service not configured' };
    }

    const response = await resend.emails.send({
      from: 'Bestcare Clinic <onboarding@resend.dev>',
      to: doctorEmail,
      subject: 'Appointment Cancelled - Bestcare Clinic',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Appointment Cancelled</h2>
          <p>Dr. Baidar Hussain,</p>
          <p>An appointment has been cancelled.</p>
          
          <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Patient:</strong> ${patientName}</p>
            <p><strong>Date:</strong> ${appointmentDate}</p>
            <p><strong>Time:</strong> ${appointmentTime}</p>
            <p><strong>Booking Reference:</strong> ${bookingId.slice(0, 8).toUpperCase()}</p>
          </div>
          
          <p>The time slot is now available for other patients.</p>
          
          <p>Best regards,<br/>Bestcare Clinic System</p>
        </div>
      `,
    });

    return { success: true, data: response };
  } catch (error) {
    console.error('Error sending doctor cancellation notification:', error);
    return { success: false, error };
  }
}
