import { NextResponse } from 'next/server';
import { transporter, getAdminHtml, getCustomerHtml } from '@/lib/email-utils';

// This is the webhook handler for Razorpay
// It ensures that even if the user closes their browser, the order email is still sent.
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const event = body.event;

        console.log('Razorpay Webhook Received:', event);

        // We only care about successful payments
        if (event === 'payment.captured' || event === 'order.paid') {
            const payment = body.payload.payment.entity;
            const notes = payment.notes;

            // Check if we have the necessary order data in notes
            if (notes && notes.name && notes.email) {
                const orderData = {
                    orderId: payment.order_id || payment.id,
                    name: notes.name,
                    mobile: notes.mobile,
                    email: notes.email,
                    address: notes.address,
                    city: notes.city,
                    state: notes.state,
                    pincode: notes.pincode,
                    variant: notes.variant,
                    qty: notes.qty,
                    total: notes.total,
                    payment: "UPI/ONLINE (Webhook Verified)"
                };

                console.log('Sending Webhook Order Emails for:', orderData.orderId);

                // Send to Admin
                await transporter.sendMail({
                    from: `"Multivitaz Order (Webhook)" <${process.env.SMTP_USER}>`,
                    to: process.env.ADMIN_EMAIL,
                    subject: `🚨 NEW ORDER [WEBHOOK]: ${orderData.name} (${orderData.variant})`,
                    html: getAdminHtml(orderData),
                });

                // Send to Customer
                await transporter.sendMail({
                    from: `"Multivitaz" <${process.env.SMTP_USER}>`,
                    to: orderData.email,
                    subject: `✨ Order Confirmed: Your Multivitaz Journey Begins!`,
                    html: getCustomerHtml(orderData),
                });

                return NextResponse.json({ success: true, message: 'Webhook emails sent' });
            }
        }

        return NextResponse.json({ success: true, message: 'Event ignored' });
    } catch (error: any) {
        console.error('Webhook Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 } as any);
    }
}
