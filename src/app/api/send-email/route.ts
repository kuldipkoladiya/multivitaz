import { NextResponse } from 'next/server';
import { transporter, getAdminHtml, getCustomerHtml } from '@/lib/email-utils';

export async function POST(req: Request) {
    try {
        const orderData = await req.json();

        // Send to Admin
        await transporter.sendMail({
            from: `"Multivitaz Order" <${process.env.SMTP_USER}>`,
            to: process.env.ADMIN_EMAIL,
            subject: `${orderData.isResend ? '[RESEND] ' : ''}🚨 NEW ORDER: ${orderData.name} (${orderData.variant})`,
            html: getAdminHtml(orderData),
        });

        // Send to Customer
        if (orderData.email) {
            await transporter.sendMail({
                from: `"Multivitaz" <${process.env.SMTP_USER}>`,
                to: orderData.email,
                subject: `✨ Order Confirmed: Your Multivitaz Journey Begins!`,
                html: getCustomerHtml(orderData),
            });
        }

        return NextResponse.json({ success: true, message: 'Emails sent successfully' });
    } catch (error: any) {
        console.error('Email Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 } as any);
    }
}
