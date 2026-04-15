import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const orderData = await req.json();

        // NOTE: User needs to configure these environment variables
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '465'),
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const htmlContent = `
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #f59e0b; padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0;">New Order Received!</h1>
                </div>
                <div style="padding: 20px;">
                    <h2 style="color: #f59e0b; border-bottom: 2px solid #f59e0b; padding-bottom: 5px;">Customer Details</h2>
                    <p><strong>Name:</strong> ${orderData.name}</p>
                    <p><strong>Mobile:</strong> ${orderData.mobile}</p>
                    <p><strong>Email:</strong> ${orderData.email}</p>
                    <p><strong>Address:</strong> ${orderData.address}, ${orderData.city} - ${orderData.pincode}</p>

                    <h2 style="color: #f59e0b; border-bottom: 2px solid #f59e0b; padding-bottom: 5px; margin-top: 30px;">Order Details</h2>
                    <p><strong>Variant:</strong> ${orderData.variant}</p>
                    <p><strong>Quantity:</strong> ${orderData.qty}</p>
                    <p><strong>Payment Method:</strong> ${orderData.payment}</p>
                    <h3 style="background-color: #fef3c7; padding: 10px; border-radius: 5px; text-align: right;">
                        Total Paid: <span style="color: #d97706;">₹${orderData.total}</span>
                    </h3>
                </div>
                <div style="background-color: #f8fafc; padding: 15px; text-align: center; color: #64748b; font-size: 12px;">
                    This is an automated notification from Multivitaz Landing Page.
                </div>
            </div>
        `;

        await transporter.sendMail({
            from: `"Multivitaz System" <${process.env.SMTP_USER}>`,
            to: process.env.ADMIN_EMAIL || orderData.email, // Defaults to user email if admin not set
            subject: `New Order: ${orderData.variant} - ${orderData.name}`,
            html: htmlContent,
        });

        return NextResponse.json({ success: true, message: 'Email sent successfully' });
    } catch (error: any) {
        console.error('Email Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
