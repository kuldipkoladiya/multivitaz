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

        const adminHtml = `
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #f59e0b; padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0;">New Order Received!</h1>
                    <p style="color: #fef3c7; margin: 5px 0 0; font-weight: bold;">Order ID: ${orderData.orderId || 'N/A'}</p>
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

        const customerHtml = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1a202c; max-width: 600px; margin: 0 auto; border: 1px solid #edf2f7; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <div style="background: linear-gradient(135deg, #b45309 0%, #d97706 100%); padding: 40px 20px; text-align: center;">
                    <div style="font-size: 48px; margin-bottom: 10px;">✨</div>
                    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Order Confirmed!</h1>
                    <p style="color: #fef3c7; margin-top: 10px; font-weight: 600;">Thank you for choosing MULTIVITAZ</p>
                </div>
                
                <div style="padding: 30px; background-color: white;">
                    <p style="font-size: 16px; line-height: 1.6; color: #4a5568;">Hi <strong>${orderData.name}</strong>,</p>
                    <p style="font-size: 16px; line-height: 1.6; color: #4a5568;">Your secret to healthier, stronger hair is officially on its way! We've received your order and our team is already preparing it for dispatch.</p>
                    
                    <div style="margin: 30px 0; padding: 20px; background-color: #fffbeb; border-radius: 12px; border: 1px solid #fef3c7;">
                        <h3 style="margin-top: 0; color: #b45309; font-size: 18px;">Order Summary</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 0; color: #718096;">Order ID:</td>
                                <td style="padding: 8px 0; text-align: right; font-weight: 700; color: #b45309;">${orderData.orderId || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #718096;">Package:</td>
                                <td style="padding: 8px 0; text-align: right; font-weight: 600;">${orderData.variant}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #718096;">Delivery Status:</td>
                                <td style="padding: 8px 0; text-align: right; font-weight: 600; color: #059669;">Confirmed</td>
                            </tr>
                            <tr style="border-top: 1px solid #fef3c7;">
                                <td style="padding: 12px 0; font-weight: 700; color: #1a202c;">Total Paid:</td>
                                <td style="padding: 12px 0; text-align: right; font-weight: 800; color: #b45309; font-size: 20px;">₹${orderData.total}</td>
                            </tr>
                        </table>
                    </div>

                    <div style="text-align: center; margin-top: 30px;">
                        <h4 style="margin-bottom: 5px; color: #1a202c;">🚚 Expected Delivery</h4>
                        <p style="margin-top: 0; color: #d97706; font-weight: 700; font-size: 18px;">4 - 5 Business Days</p>
                    </div>

                    <p style="font-size: 14px; color: #718096; text-align: center; margin-top: 40px;">
                        Need assistence? Reply to this email or reach us on WhatsApp at +91 8849227299
                    </p>
                </div>

                <div style="background-color: #1a202c; padding: 20px; text-align: center;">
                    <p style="color: #a0aec0; margin: 0; font-size: 12px;">&copy; 2026 Multivitaz. All rights reserved.</p>
                </div>
            </div>
        `;

        // Send to Admin
        await transporter.sendMail({
            from: `"Multivitaz Order" <${process.env.SMTP_USER}>`,
            to: process.env.ADMIN_EMAIL,
            subject: `🚨 NEW ORDER: ${orderData.name} (${orderData.variant})`,
            html: adminHtml,
        });

        // Send to Customer
        await transporter.sendMail({
            from: `"Multivitaz" <${process.env.SMTP_USER}>`,
            to: orderData.email,
            subject: `✨ Order Confirmed: Your Multivitaz Journey Begins!`,
            html: customerHtml,
        });

        return NextResponse.json({ success: true, message: 'Emails sent successfully' });
    } catch (error: any) {
        console.error('Email Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 } as any);
    }
}
