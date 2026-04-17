"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShoppingCart, Users, Star, CheckCircle, ShieldCheck, Leaf, Activity,
    Droplets, Info, Plus, Minus, User, Phone, Mail, MapPin,
    Building, Hash, MessageCircle, X, Sparkles, Play, Pause,
    RefreshCcw, Award, Truck, Banknote, Headset, LifeBuoy, Gift,
    ChevronDown, ChevronLeft, ChevronRight, Timer, Zap, Crown
} from "lucide-react";
import jsPDF from "jspdf";

export default function Home() {
    // Social Icons as SVGs due to local lucide version limitations
    const InstagramIcon = (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
    );

    const FacebookIcon = (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
    );

    const WhatsAppIcon = (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.015 12.03c0 2.12.559 4.191 1.62 6.06L0 24l6.117-1.604a11.845 11.845 0 005.932 1.577h.005c6.632 0 12.03-5.396 12.033-12.03a11.85 11.85 0 00-3.528-8.503z"/>
        </svg>
    );

    // ✅ VARIANTS DATA
    const variants = {
        "trial": {
            label: "Free Trial – 10 Days",
            price: 0,
            codPrice: 0,
            oldPrice: 280,
            isFree: true,
            deliveryCharge: 99,
            images: ["/images/1.jpg", "/images/2.jpg", "/images/11.jpg", "/images/12.jpg", "/images/15.jpg", "/images/16.jpg", "/images/17.jpg"],
        },
        "30": {
            label: "30 Tablet – 1 Month",
            price: 499,
            codPrice: 549,
            oldPrice: 840,
            isFree: false,
            deliveryCharge: 0,
            images: ["/images/4.jpg", "/images/11.jpg", "/images/12.jpg", "/images/15.jpg", "/images/16.jpg", "/images/17.jpg"],
        },
        "60": {
            label: "60 Tablet – 2 Month",
            price: 899,
            codPrice: 949,
            oldPrice: 1680,
            isFree: false,
            deliveryCharge: 0,
            images: ["/images/10.jpg", "/images/11.jpg", "/images/12.jpg", "/images/15.jpg", "/images/16.jpg", "/images/17.jpg"],
        },
    } as const;

    const [open, setOpen] = useState(false);
    const [qty, setQty] = useState(1);
    const [payment, setPayment] = useState("upi");
    const [current, setCurrent] = useState(0);
    const [success, setSuccess] = useState(false);
    const [paymentError, setPaymentError] = useState<null | 'failed' | 'incomplete'>(null);
    const [activeVideo, setActiveVideo] = useState<any>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // ✅ FREE TRIAL CLAIMED TRACKING
    const [trialClaimed, setTrialClaimed] = useState(false);

    // ✅ VARIANT
    const [variant, setVariant] = useState<keyof typeof variants>("trial");

    // ✅ FAKE NOTIFICATION
    const [notification, setNotification] = useState<any>(null);

    // ✅ POLICY MODAL STATE
    const [showPolicy, setShowPolicy] = useState<string | null>(null);

    const BUSINESS_NAME = "Medilio Enterprise Pvt. Ltd.";
    const OFFICE_ADDRESS = "7015/C, 7th Floor, Bellagio Textile Market, Nr. Rajmahal AC Mall, Sitanagar Char Rasta, Punagam, Surat-395010";
    const SUPPORT_EMAIL = "help.multivitaz@gmail.com";
    const SUPPORT_PHONE = "8849227299";
    const DELIVERY_TIMELINE = "4-5 business days across India";

    // ✅ FAQ STATE
    const [faqForm, setFaqForm] = useState({
        name: "",
        mobile: "",
        question: "",
    });

    // ✅ FAQ ACCORDION STATE
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    // ✅ COUNTDOWN TIMER STATE
    const [timeLeft, setTimeLeft] = useState({
        hours: 23,
        minutes: 59,
        seconds: 59
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                const totalSeconds = prev.hours * 3600 + prev.minutes * 60 + prev.seconds - 1;
                if (totalSeconds <= 0) return { hours: 0, minutes: 0, seconds: 0 };
                return {
                    hours: Math.floor(totalSeconds / 3600),
                    minutes: Math.floor((totalSeconds % 3600) / 60),
                    seconds: totalSeconds % 60
                };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const [form, setForm] = useState({
        name: "",
        mobile: "",
        email: "",
        address: "",
        city: "",
        pincode: "",
    });

    const WHATSAPP_NUMBER = "918469387000";

    // ✅ MOCK VIDEOS
    const videos = [
        { id: 1, url: "/videos/1.mp4", thumb: "/images/2.jpg", title: "Amazing Growth" },
        { id: 2, url: "/videos/2.mp4", thumb: "/images/3.jpg", title: "2 Weeks Result" },
        { id: 3, url: "/videos/3.mp4", thumb: "/images/4.jpg", title: "Thicker Hair Fast" },
    ];

    const selectedVariant = variants[variant];
    const isUPI = payment === "upi";

    // Determine base price based on payment method
    const basePrice = (variant === "30" || variant === "60")
        ? (isUPI ? selectedVariant.price : selectedVariant.codPrice)
        : selectedVariant.price;

    const oldPrice = selectedVariant.oldPrice;
    const images = selectedVariant.images;
    const isFreeVariant = selectedVariant.isFree;
    const deliveryCharge = selectedVariant.deliveryCharge;

    // Subtotal
    const subtotal = isFreeVariant ? 0 : qty * basePrice;

    // Extra Discount Logic - Applies ONLY to UPI
    let extraDiscountPercent = 0;
    if (isUPI && !isFreeVariant) {
        if (subtotal >= 1199) {
            extraDiscountPercent = 15;
        } else if (subtotal >= 599) {
            extraDiscountPercent = 10;
        }
    }

    const extraDiscountAmount = Math.round((subtotal * extraDiscountPercent) / 100);
    const total = subtotal - extraDiscountAmount;
    const grandTotal = isFreeVariant ? deliveryCharge : total;

    // ✅ HERO IMAGE AUTO-SLIDE
    const [slideDirection, setSlideDirection] = useState(1);

    const goToNextImage = useCallback(() => {
        setSlideDirection(1);
        setCurrent((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const goToPrevImage = useCallback(() => {
        setSlideDirection(-1);
        setCurrent((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    // Auto-slide every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            goToNextImage();
        }, 3000);
        return () => clearInterval(interval);
    }, [goToNextImage]);

    // ✅ CHECK IF TRIAL ALREADY CLAIMED ON MOUNT
    useEffect(() => {
        const claimed = localStorage.getItem("multivitaz_trial_claimed");
        if (claimed === "true") {
            setTrialClaimed(true);
            setVariant("30"); // default to 30 tablets if trial already claimed
        }
    }, []);

    useEffect(() => {
        const t = setTimeout(() => setOpen(true), 12000);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    // reset image when variant changes
    useEffect(() => {
        setCurrent(0);
        // Force prepaid (UPI) for free trial variant
        if (variant === "trial") {
            setPayment("upi");
        }
    }, [variant]);

    // 🔥 UPDATED NOTIFICATION LOGIC (WITH LOCATION)
    useEffect(() => {
        const names = [
            "Rahul Sharma", "Priya Verma", "Amit Patel", "Neha Singh",
            "Karan Mehta", "Riya Shah", "Vikas Yadav", "Sneha Joshi",
            "Suresh Patel", "Ramesh Gupta", "Anjali Yadav", "Deepak Mishra",
            "Pooja Tiwari", "Sunil Chauhan", "Kavita Kumari", "Rajesh Das",
            "Arjun Reddy", "Lakshmi Iyer", "Mohan Desai", "Heena Trivedi",
            "Ajay Kulkarni", "Shweta Shukla", "Rohit Khanna", "Simran Kaur",
            "Tarun Rawat", "Nidhi Agarwal", "Yogesh Bansal", "Dinesh Solanki",
            "Komal Saxena", "Sameer Malik", "Ritu Arora", "Ashok Nayak",
            "Ananya Panda", "Mahesh Naik", "Poonam Thakur", "Vinod Dogra",
            "Ayesha Qureshi", "Raju Kushwaha", "Shalini Tripathi", "Mukesh Pandey",
            "Kavya Naidu", "Tejas Joshi", "Bharat Vyas", "Hiral Modi",
            "Jignesh Parmar", "Umesh Roy", "Sangeeta Dutta", "Rishi Choudhary",
            "Neelam Srivastava", "Kamal Joshi", "Meena Purohit", "Manish Hooda",
            "Sunita Dalal", "Abhishek Tanwar", "Preeti Dahiya", "Akash Jha",
            "Santosh Mahato", "Kiran Prasad", "Pradeep Shetty", "Asha Hegde",
            "Raghav Pai", "Anu Nair", "Thomas Varghese", "Maria Mathew",
            "Imran Khan", "Sana Ali", "Arif Shaikh", "Farah Pathan",
            "Javed Ansari", "Nazia Momin", "Dev Chavan", "Tushar Patil",
            "Pravin Jadhav", "Shilpa Kale", "Dilip Wagh", "Nisha Bisht",
            "Bipin Bora", "Monika Lyngdoh", "Tapan Singh", "Karthik Subramanian",
            "Balaji Krishnan", "Revathi Pillai", "Naveed Ahmed", "Sravani Goud",
            "Pavan Kumar", "Lokendra Dubey", "Bhavna Rabari", "Hardik Gohil",
            "Paras Dave", "Rina Solanki", "Kirtan Prajapati", "Vimal Damor"
        ];

        const cities = [
            "Surat", "Ahmedabad", "Mumbai", "Delhi", "Pune", "Jaipur", "Rajkot", "Vadodara",
            "Lucknow", "Bhopal", "Indore", "Nagpur", "Patna", "Kolkata", "Chandigarh",
            "Hyderabad", "Chennai", "Nashik", "Kanpur", "Amritsar", "Ludhiana",
            "Dehradun", "Agra", "Meerut", "Jodhpur", "Udaipur", "Noida", "Gurugram",
            "Faridabad", "Raipur", "Bhubaneswar", "Goa", "Shimla", "Jammu", "Srinagar",
            "Gwalior", "Varanasi", "Prayagraj", "Tirupati", "Jamnagar", "Bhavnagar",
            "Gandhinagar", "Anand", "Morbi", "Siliguri", "Durgapur", "Aligarh",
            "Bareilly", "Kota", "Ajmer", "Hisar", "Panipat", "Rewari", "Rohtak",
            "Darbhanga", "Muzaffarpur", "Bokaro", "Dhanbad", "Bellary", "Mysore",
            "Mangalore", "Kochi", "Trivandrum", "Kottayam", "Malappuram", "Kozhikode",
            "Aurangabad", "Nanded", "Latur", "Solapur", "Satara", "Kolhapur",
            "Jalgaon", "Sangli", "Akola", "Yavatmal", "Wardha", "Haldwani",
            "Guwahati", "Shillong", "Imphal", "Aizawl", "Itanagar", "Kohima",
            "Coimbatore", "Madurai", "Salem", "Erode", "Karimnagar", "Warangal",
            "Vijayawada", "Guntur", "Ujjain", "Kutch", "Navsari", "Vapi",
            "Bharuch", "Palanpur", "Mehsana", "Dahod"
        ];

        const interval = setInterval(() => {
            const randomName = names[Math.floor(Math.random() * names.length)];
            const randomCity = cities[Math.floor(Math.random() * cities.length)];

            // Pick a random variant
            const variantKeys = Object.keys(variants);
            const randomVariantKey = variantKeys[Math.floor(Math.random() * variantKeys.length)] as keyof typeof variants;
            const randomVariant = variants[randomVariantKey];
            const isTrial = randomVariant.isFree;

            const randomQty = isTrial ? 1 : Math.floor(Math.random() * 3) + 1;

            setNotification({
                name: randomName,
                city: randomCity,
                qty: randomQty,
                variant: randomVariant.label,
                isTrial: isTrial
            });

            setTimeout(() => {
                setNotification(null);
            }, 3000);

        }, 25000);

        return () => clearInterval(interval);
    }, [selectedVariant.label]);

    const handleFaqSubmit = () => {
        if (!faqForm.name || !faqForm.mobile || !faqForm.question) return;

        const msg = `❓ FAQ Inquiry\n👤 Name: ${faqForm.name}\n📱 Mobile: ${faqForm.mobile}\n💬 Question: ${faqForm.question}`;
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`);
        setFaqForm({ name: "", mobile: "", question: "" });
    };

    const isFormValid =
        form.name &&
        form.mobile &&
        form.email &&
        form.address &&
        form.city &&
        form.pincode;

    const generateAndDownloadReceipt = (orderId: string = "N/A") => {
        try {
            const doc = new jsPDF();
            const date = new Date().toLocaleString();

            // Header
            doc.setFillColor(245, 158, 11); // Amber-500
            doc.rect(0, 0, 210, 40, 'F');

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(28);
            doc.setFont("helvetica", "bold");
            doc.text("MULTIVITAZ", 105, 20, { align: "center" });
            doc.setFontSize(12);
            doc.text("Advanced Hair Grow+ Formula", 105, 30, { align: "center" });

            // Order Info
            doc.setTextColor(51, 65, 85); // Slate-700
            doc.setFontSize(16);
            doc.text("ORDER RECEIPT", 20, 55);

            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text(`Date: ${date}`, 140, 55);
            doc.text(`Receipt ID: MVZ-${Math.floor(Math.random() * 1000000)}`, 140, 60);
            if (orderId !== "N/A") doc.text(`Order ID: ${orderId}`, 140, 65);

            // Customer Details
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text("Customer Details:", 20, 75);
            doc.setDrawColor(226, 232, 240);
            doc.line(20, 77, 190, 77);

            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text(`Name: ${form.name}`, 25, 85);
            doc.text(`Mobile: ${form.mobile}`, 25, 92);
            doc.text(`Email: ${form.email}`, 25, 99);
            doc.text(`Address: ${form.address}, ${form.city} - ${form.pincode}`, 25, 106);

            // Order Table
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text("Order Summary:", 20, 120);

            doc.setFillColor(248, 250, 252); // Slate-50
            doc.rect(20, 125, 170, 10, 'F');
            doc.setFontSize(10);
            doc.text("Item", 25, 132);
            doc.text("Qty", 120, 132);
            doc.text("Amount", 160, 132);

            doc.setFont("helvetica", "normal");
            doc.text(`MULTIVITAZ Hair Grow+ (${selectedVariant.label})`, 25, 145);
            doc.text(`${isFreeVariant ? '1' : qty}`, 123, 145);
            doc.text(`Rs. ${isFreeVariant ? '0' : subtotal}`, 160, 145);

            doc.line(20, 152, 190, 152);

            // Totals
            const totalY = 165;
            doc.text("Subtotal:", 130, totalY);
            doc.text(`Rs. ${subtotal}`, 165, totalY);

            if (extraDiscountAmount > 0) {
                doc.setTextColor(22, 163, 74); // Green-600
                doc.text(`Discount (${extraDiscountPercent}%):`, 130, totalY + 7);
                doc.text(`- Rs. ${extraDiscountAmount}`, 165, totalY + 7);
                doc.setTextColor(51, 65, 85);
            }

            if (isFreeVariant) {
                doc.text("Delivery Charge:", 130, totalY + 7);
                doc.text(`Rs. ${deliveryCharge}`, 165, totalY + 7);
            } else {
                doc.text("Delivery:", 130, totalY + 14);
                doc.text("FREE", 165, totalY + 14);
            }

            if (isFreeVariant) {
                doc.text("Total Payable (Prepaid):", 130, totalY + 25);
                doc.text(`Rs. ${grandTotal}`, 165, totalY + 25);
            } else {
                doc.text("Total Payable:", 130, totalY + 25);
                doc.text(`Rs. ${grandTotal}`, 165, totalY + 25);
            }

            // Footer
            doc.setFontSize(10);
            doc.setFont("helvetica", "italic");
            doc.setTextColor(148, 163, 184); // Slate-400
            doc.text("Thank you for choosing MULTIVITAZ!", 105, 200, { align: "center" });
            doc.text("For any support, please contact us on WhatsApp.", 105, 205, { align: "center" });

            doc.save(`Multivitaz_Receipt_${form.name.replace(/\s+/g, '_')}.pdf`);
        } catch (error) {
            console.error("PDF Generation Error:", error);
        }
    };
    const handleOrder = async () => {
        if (!isFormValid || isProcessing) return;

        setIsProcessing(true);

        const msg = isFreeVariant
            ? `🎁 FREE TRIAL Order\nProduct: MULTIVITAZ Hair Grow+\nVariant: ${selectedVariant.label}\n\n👤 Name: ${form.name}\n📱 Mobile: ${form.mobile}\n📧 Email: ${form.email}\n🏠 Address: ${form.address}\n🏙️ City: ${form.city}\n📍 Pincode: ${form.pincode}\n\n📦 Qty: 1\n💰 Product: FREE (₹0)\n🚚 Delivery Charge: ₹${deliveryCharge}\n💰 Total: ₹${deliveryCharge}\n💳 Payment: PREPAID`
            : `🛒 Order Details\nProduct: MULTIVITAZ Hair Grow+\nVariant: ${payment === 'upi' ? 'Prepaid Order' : 'COD Order'} ${selectedVariant.label}\n\n👤 Name: ${form.name}\n📱 Mobile: ${form.mobile}\n📧 Email: ${form.email}\n🏠 Address: ${form.address}\n🏙️ City: ${form.city}\n📍 Pincode: ${form.pincode}\n\n📦 Qty: ${qty}\n🚚 Delivery: FREE\n💰 Total: ₹${total}\n💳 Payment: ${payment}`;

        // ✅ HANDLE COD (ONLY FOR PAID VARIANTS)
        if (payment === "cod" && !isFreeVariant) {
            try {
                // Auto-download receipt
                generateAndDownloadReceipt();

                // Notify Admin via Email
                await fetch('/api/send-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...form,
                        variant: selectedVariant.label,
                        qty: qty,
                        total: grandTotal,
                        payment: "COD"
                    })
                }).catch(err => console.error("Email notification failed", err));

                window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`);
                setOpen(false);
                setSuccess(true);
            } catch (err) {
                console.error("COD processing error:", err);
                setPaymentError('failed');
            } finally {
                setIsProcessing(false);
            }
            return;
        }

        // ✅ HANDLE ONLINE PAYMENT (RAZORPAY)
        try {
            const res = await fetch("https://multivitaz-be.vercel.app/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: grandTotal }),
            });

            const order = await res.json();
            if (!order.id) throw new Error("Order creation failed");

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: "INR",
                order_id: order.id,
                name: "MULTIVITAZ",
                description: "Premium Hair Care",
                method: {
                    upi: { flow: "collect" },
                    card: true,
                    netbanking: true,
                    wallet: true,
                },

                handler: async function (response: any) {
                    try {
                        // Strict Verification
                        const verifyRes = await fetch("https://multivitaz-be.vercel.app/verify-payment", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                ...response,
                                formData: form,
                                qty: isFreeVariant ? 1 : qty,
                                total: grandTotal,
                                variant: selectedVariant.label,
                            }),
                        });

                        const verifyData = await verifyRes.json();

                        // Auto-download receipt
                        generateAndDownloadReceipt(response.razorpay_order_id);

                        // Notify Admin via Email
                        fetch('/api/send-email', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                ...form,
                                variant: selectedVariant.label,
                                qty: isFreeVariant ? 1 : qty,
                                total: grandTotal,
                                payment: "UPI/ONLINE"
                            })
                        }).catch(err => console.error("Email notification failed", err));

                        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`);

                        // Trial Claim logic
                        if (isFreeVariant) {
                            localStorage.setItem("multivitaz_trial_claimed", "true");
                            setTrialClaimed(true);
                            setVariant("30");
                        }

                        setOpen(false);
                        setSuccess(true);
                    } catch (err) {
                        console.error("Verification failed:", err);
                        setPaymentError('failed');
                    } finally {
                        setIsProcessing(false);
                    }
                },

                modal: {
                    ondismiss: function () {
                        setPaymentError('incomplete');
                        setIsProcessing(false);
                    }
                },

                prefill: {
                    name: form.name,
                    email: form.email,
                    contact: form.mobile,
                },

                theme: { color: "#b45309" },
            };

            const rzp = new (window as any).Razorpay(options);

            rzp.on('payment.failed', function () {
                setPaymentError('failed');
                setIsProcessing(false);
            });

            rzp.open();

            setIsProcessing(false);
        } catch (err) {
            console.error(err);
            setPaymentError('failed');
            setIsProcessing(false);
        }
    };

    // Component for Individual Video to handle playing state easily
    const VideoCard = ({ vid }: { vid: any }) => {
        const [isPlaying, setIsPlaying] = useState(false);
        const videoRef = useRef<HTMLVideoElement | null>(null);

        const handleVideoAction = (e: React.MouseEvent) => {
            e.stopPropagation();
            setActiveVideo(vid);
        };

        return (
            <div className="relative shrink-0 snap-center sm:snap-start w-64 sm:w-72 aspect-[9/16] rounded-[2rem] overflow-hidden bg-slate-900 group shadow-lg">
                {!isPlaying && (
                    <img src={vid.thumb} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-300 z-10" alt="Video Thumbnail" />
                )}

                <video
                    ref={videoRef}
                    src={vid.url}
                    className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                    loop
                    playsInline
                    onClick={handleVideoAction}
                />

                {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                        <button className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-amber-500 group-hover:scale-110 transition-all duration-300">
                            <Play className="w-6 h-6 text-white ml-1 filter drop-shadow-md" />
                        </button>
                    </div>
                )}

                <div className={`absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 to-transparent z-20 pointer-events-none transition-opacity duration-300`}>
                    <p className="font-bold text-sm text-white drop-shadow-md mb-1">{vid.title}</p>
                    <p className="text-xs text-slate-200 line-clamp-2 drop-shadow-md leading-relaxed">See the real transformation.</p>
                </div>

                <button
                    onClick={handleVideoAction}
                    className="absolute inset-0 w-full h-full z-30 opacity-0 cursor-pointer"
                    aria-label="Open Fullscreen"
                />
            </div>
        );
    };

    return (
        <div className="bg-[#fdf8f0] min-h-screen text-slate-800 font-sans selection:bg-amber-200 selection:text-amber-900 overflow-visible relative">
            {/* Ambient Background Glows - Golden */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-amber-100/40 to-transparent pointer-events-none -z-10" />
            <div className="fixed top-[-20%] left-[-10%] w-[80%] md:w-[50%] h-[50%] rounded-full bg-amber-200/20 blur-[120px] pointer-events-none -z-10" />
            <div className="fixed bottom-[-20%] right-[-10%] w-[80%] md:w-[50%] h-[50%] rounded-full bg-yellow-200/20 blur-[120px] pointer-events-none -z-10" />

            {/* 🔥 BIG HERO BANNER */}
            <div className="w-full relative overflow-hidden bg-gradient-to-br from-[#1a0e00] via-[#2d1800] to-[#0f0800]">
                {/* Golden glow effects */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-yellow-600/15 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22 fill=%22rgba(251,191,36,0.08)%22/%3E%3C/svg%3E')] pointer-events-none" />

                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-8 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-12 relative z-10">
                    {/* Banner Text Content */}
                    <div className="flex-1 text-center md:text-left flex flex-col items-center md:items-start w-full">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-4 md:mb-5 border border-amber-500/30 backdrop-blur-sm">
                            <Crown className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            Premium Hair Care
                        </div>
                        <motion.img
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            src="/images/titel.png"
                            alt="MULTIVITAZ Hair Grow+"
                            className="w-full max-w-[280px] sm:max-w-[400px] md:max-w-[450px] lg:max-w-[500px] h-auto object-contain mb-2 md:mb-4"
                        />

                        {/* Mobile Only Product Image - Shown after title on mobile */}
                        <div className="block md:hidden w-40 sm:w-48 mt-4 relative">
                            <div className="absolute inset-0 bg-gradient-to-t from-amber-500/30 to-transparent rounded-full blur-2xl pointer-events-none" />
                            <motion.img
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                src="/images/benner svg.svg"
                                alt="Product"
                                className="w-full h-auto object-contain relative z-10 drop-shadow-[0_10px_30px_rgba(245,158,11,0.4)]"
                            />
                        </div>

                        <p className="text-amber-100/70 mt-3 sm:mt-4 text-[11px] sm:text-base md:text-lg max-w-md mx-auto md:mx-0 leading-relaxed">
                            Advanced clinical-grade formula with Biotin & 18 Amino Acids for thicker, stronger, healthier hair.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center gap-3 mt-4 sm:mt-7 justify-center md:justify-start">
                            <button
                                onClick={() => {
                                    if (trialClaimed) {
                                        setVariant("30");
                                    } else {
                                        setVariant("trial");
                                    }
                                    setOpen(true);
                                }}
                                className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-900 font-black px-3 sm:px-8 py-2 sm:py-3.5 rounded-full text-[10px] sm:text-base shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                            >
                                <Gift className="w-4 h-4 sm:w-5 sm:h-5" />
                                {trialClaimed ? "Get 30 Tablets Pack" : "Get FREE 10-Day Trial"}
                            </button>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 sm:gap-6 mt-5 sm:mt-6 justify-center md:justify-start">
                            <span className="flex items-center gap-1.5 text-amber-200/60 text-xs font-medium"><ShieldCheck className="w-3.5 h-3.5 text-amber-400/60" /> GMP Certified</span>
                            <span className="flex items-center gap-1.5 text-amber-200/60 text-xs font-medium"><Award className="w-3.5 h-3.5 text-amber-400/60" /> FSSAI Approved</span>
                            <span className="flex items-center gap-1.5 text-amber-200/60 text-xs font-medium"><Truck className="w-3.5 h-3.5 text-amber-400/60" /> Free Delivery</span>
                        </div>
                    </div>

                    {/* Banner Product Image - Hidden on mobile, shown on desktop */}
                    <div className="hidden md:block flex-shrink-0 w-28 sm:w-56 md:w-72 lg:w-80 relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-amber-500/30 to-transparent rounded-full blur-3xl pointer-events-none" />
                        <motion.img
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            src="/images/benner svg.svg"
                            alt="MULTIVITAZ Hair Grow+ Product"
                            className="w-full h-auto object-contain relative z-10 drop-shadow-[0_20px_50px_rgba(245,158,11,0.3)]"
                        />
                    </div>
                </div>
            </div>

            {/* NOTIFICATION UI */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95, filter: "blur(4px)" }}
                        transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
                        className="fixed top-4 left-4 right-4 md:left-auto md:translate-x-0 md:right-6 bg-white/90 backdrop-blur-xl border border-amber-100/50 text-slate-800 px-4 py-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-50 flex items-center gap-4 md:w-auto overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent pointer-events-none" />
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                            <ShoppingCart className="w-5 h-5 text-amber-600" />
                        </div>
                        <div className="text-sm font-medium leading-snug flex-1">
                            <p>
                                <span className="font-bold text-slate-900">{notification.name}</span> from <span className="text-amber-700 font-semibold">{notification.city}</span>
                            </p>
                            <p className="text-slate-500 text-xs mt-0.5">
                                Purchased {!notification.isTrial && `${notification.qty}x `}{notification.variant}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-32 sm:pb-40">
                {/* HERO SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 lg:gap-16 items-start">

                    {/* IMAGES */}
                    <div className="space-y-3 sm:space-y-6 lg:sticky lg:top-8 z-10 w-full max-w-md mx-auto lg:max-w-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white rounded-2xl sm:rounded-[2rem] p-3 sm:p-6 shadow-sm border border-amber-100/50 relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-amber-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            {/* Previous Button */}
                            <button
                                onClick={goToPrevImage}
                                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white backdrop-blur-sm shadow-lg border border-amber-200/50 flex items-center justify-center text-slate-600 hover:text-amber-600 transition-all hover:scale-110 active:scale-95"
                                aria-label="Previous image"
                            >
                                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>

                            {/* Next Button */}
                            <button
                                onClick={goToNextImage}
                                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white backdrop-blur-sm shadow-lg border border-amber-200/50 flex items-center justify-center text-slate-600 hover:text-amber-600 transition-all hover:scale-110 active:scale-95"
                                aria-label="Next image"
                            >
                                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>

                            <AnimatePresence mode="wait" initial={false}>
                                <motion.img
                                    key={current}
                                    initial={{ opacity: 0, x: slideDirection * 40 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: slideDirection * -40 }}
                                    transition={{ duration: 0.3 }}
                                    src={images[current]}
                                    alt="MULTIVITAZ Hair Grow+"
                                    className="w-full h-[220px] sm:h-[350px] md:h-[400px] object-contain relative z-10 drop-shadow-xl"
                                />
                            </AnimatePresence>

                            {/* Slide Indicators */}
                            <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
                                {images.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => { setSlideDirection(i > current ? 1 : -1); setCurrent(i); }}
                                        className={`rounded-full transition-all duration-300 ${current === i ? "w-6 h-2 bg-amber-500" : "w-2 h-2 bg-slate-300 hover:bg-slate-400"}`}
                                        aria-label={`Go to slide ${i + 1}`}
                                    />
                                ))}
                            </div>
                        </motion.div>

                        <div className="flex justify-center sm:justify-start gap-2 sm:gap-4 overflow-x-auto pb-2 sm:pb-4 scrollbar-hide snap-x">
                            {images.map((img, i) => (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    key={i}
                                    onClick={() => { setSlideDirection(i > current ? 1 : -1); setCurrent(i); }}
                                    className={`relative w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden shrink-0 snap-start border-2 transition-all duration-300 ${current === i ? "border-amber-500 shadow-md shadow-amber-500/20" : "border-slate-200 border-transparent hover:border-amber-200 bg-white"
                                        }`}
                                >
                                    <div className="absolute inset-0 bg-slate-50" />
                                    <img src={img} className="w-full h-full object-contain relative z-10 p-2" alt={`Thumbnail ${i + 1}`} />
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* DETAILS */}
                    <div className="flex flex-col justify-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-center lg:text-left px-1 sm:px-0"
                        >
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 text-amber-800 text-xs font-bold tracking-wider uppercase mb-5 sm:mb-6 shadow-sm border border-amber-200">
                                <Sparkles className="w-3.5 h-3.5" />
                                Premium Biotin Advance Formula
                            </div>

                            <div className="flex justify-center lg:justify-start">
                                <motion.img
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                    src="/images/titel.png"
                                    alt="MULTIVITAZ Hair Grow+"
                                    className="w-full max-w-[240px] sm:max-w-[320px] lg:max-w-[400px] h-auto object-contain"
                                />
                            </div>

                            <p className="text-sm sm:text-lg text-slate-600 mt-4 sm:mt-6 leading-relaxed max-w-lg mx-auto lg:mx-0">
                                Advanced clinical-grade hair growth supplement meticulously crafted with Biotin, 18 vital amino acids, vitamins, and minerals for luscious, stronger hair.
                            </p>

                            {/* PRICE */}
                            <div className={`mt-5 sm:mt-8 flex flex-wrap items-baseline justify-center lg:justify-start gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl shadow-sm w-full sm:w-fit ${isFreeVariant ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-300' : 'bg-white border border-amber-100/50'}`}>
                                {isFreeVariant ? (
                                    <>
                                        <span className="text-4xl sm:text-5xl font-black text-amber-600 tracking-tight">FREE</span>
                                        <span className="text-lg sm:text-xl line-through text-slate-400 font-medium decoration-slate-300">₹{oldPrice}</span>
                                        <div className="bg-amber-100 text-amber-700 px-3 py-1 rounded-lg font-bold text-xs sm:text-sm ml-2 flex items-center gap-1">
                                            <Gift className="w-3.5 h-3.5" /> 100% OFF
                                        </div>
                                        {/*<div className="w-full mt-2 flex items-center gap-1.5 text-xs text-amber-700 font-semibold">*/}
                                        {/*    /!*<Truck className="w-3.5 h-3.5" /> Delivery Charge: ₹{deliveryCharge}*!/*/}
                                        {/*</div>*/}
                                    </>
                                ) : (
                                    <>
                                        <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">₹{basePrice}</span>
                                        <span className="text-lg sm:text-xl line-through text-slate-400 font-medium decoration-slate-300">₹{oldPrice}</span>
                                        <div className="bg-rose-100 text-rose-600 px-3 py-1 rounded-lg font-bold text-xs sm:text-sm ml-2">
                                            SAVE {Math.round(((oldPrice - basePrice) / oldPrice) * 100)}%
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="flex justify-center lg:justify-start">
                                <p className="text-rose-500 mt-4 flex items-center gap-2 font-medium bg-rose-50 w-fit px-4 py-2 rounded-full text-sm">
                                    <Activity className="w-4 h-4 animate-pulse" />
                                    Demand is High — Only 5 left!
                                </p>
                            </div>

                            {/* TIMER */}
                            <div className="mt-8 flex items-center gap-4 bg-amber-50 border border-amber-100 p-4 rounded-2xl w-full sm:w-fit">
                                <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
                                    <Timer className="w-6 h-6 text-white animate-pulse" />
                                </div>
                                <div>
                                    <p className="text-[10px] sm:text-xs font-bold text-amber-600 uppercase tracking-widest leading-none mb-1">Flash Sale Ending In</p>
                                    <div className="flex items-center gap-2">
                                        <div className="flex flex-col items-center">
                                            <span className="text-xl sm:text-2xl font-black text-slate-900 leading-none">{String(timeLeft.hours).padStart(2, '0')}</span>
                                            <span className="text-[8px] font-bold text-slate-400 uppercase">hrs</span>
                                        </div>
                                        <span className="text-xl font-bold text-amber-500 mb-2">:</span>
                                        <div className="flex flex-col items-center">
                                            <span className="text-xl sm:text-2xl font-black text-slate-900 leading-none">{String(timeLeft.minutes).padStart(2, '0')}</span>
                                            <span className="text-[8px] font-bold text-slate-400 uppercase">min</span>
                                        </div>
                                        <span className="text-xl font-bold text-amber-500 mb-2">:</span>
                                        <div className="flex flex-col items-center">
                                            <span className="text-xl sm:text-2xl font-black text-slate-900 leading-none">{String(timeLeft.seconds).padStart(2, '0')}</span>
                                            <span className="text-[8px] font-bold text-slate-400 uppercase">sec</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden sm:block h-8 w-px bg-amber-200 mx-2" />
                                <div className="hidden sm:flex flex-col">
                                    <span className="text-amber-700 font-bold text-sm">CLAIM 🎁 FREE</span>
                                    <span className="text-amber-600/70 text-[10px] font-medium">Limited Trial Offer</span>
                                </div>
                            </div>

                            {/* VARIANTS - Fixed layout */}
                            <div className="mt-6 sm:mt-10">
                                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3 sm:mb-4 hidden sm:block">Choose Package</h3>
                                <div className="flex flex-col gap-2.5 sm:gap-3">
                                    {(["trial", "30", "60"] as Array<keyof typeof variants>).map((v) => {
                                        const isTrialVariant = v === "trial";
                                        const isSelected = variant === v;
                                        const isTrialDisabled = isTrialVariant && trialClaimed;
                                        return (
                                            <button
                                                key={v}
                                                onClick={() => !isTrialDisabled && setVariant(v)}
                                                disabled={isTrialDisabled}
                                                className={`relative px-4 sm:px-5 py-3 sm:py-4 rounded-2xl font-bold transition-all duration-300 w-full flex items-center gap-3 overflow-hidden text-left ${isTrialDisabled
                                                    ? "text-slate-400 bg-slate-100 ring-1 ring-slate-200 cursor-not-allowed opacity-60"
                                                    : isTrialVariant
                                                        ? isSelected
                                                            ? "text-amber-900 ring-2 ring-amber-400 shadow-[0_8px_25px_-4px_rgba(245,158,11,0.4)] bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50"
                                                            : "text-amber-700 bg-gradient-to-br from-amber-50 to-yellow-50 ring-2 ring-amber-300 hover:ring-amber-400 shadow-md hover:shadow-lg animate-pulse"
                                                        : isSelected
                                                            ? "text-amber-900 ring-2 ring-amber-500 shadow-[0_8px_20px_-4px_rgba(217,119,6,0.3)] bg-gradient-to-br from-amber-50 to-amber-100/50"
                                                            : "text-slate-600 bg-white ring-1 ring-slate-200 hover:ring-amber-300 hover:bg-amber-50/30 shadow-sm"
                                                    }`}
                                            >
                                                {isSelected && !isTrialDisabled && (
                                                    <motion.div layoutId="activeVariant" className={`absolute inset-0 w-full ${isTrialVariant ? 'bg-amber-100/30' : 'bg-amber-100/20'}`} />
                                                )}
                                                {isTrialVariant && !trialClaimed && (
                                                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-rose-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full z-20 shadow-lg shadow-red-500/30 animate-bounce">
                                                        🎁 FREE
                                                    </span>
                                                )}
                                                {isTrialVariant && trialClaimed && (
                                                    <span className="absolute -top-1 -right-1 bg-slate-400 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full z-20 shadow-sm">
                                                        ✓ Claimed
                                                    </span>
                                                )}
                                                <div className="relative z-10 flex items-center gap-3 flex-1 min-w-0">
                                                    {isTrialVariant && <Gift className={`w-5 h-5 shrink-0 ${trialClaimed ? 'text-slate-400' : 'text-amber-500'}`} />}
                                                    {!isTrialVariant && <Crown className="w-5 h-5 shrink-0 text-amber-500" />}
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-sm sm:text-base font-bold truncate">
                                                            {variants[v].label}
                                                        </span>
                                                        {isTrialVariant && !trialClaimed && (
                                                            <span className="text-[10px] sm:text-xs text-amber-600/70 font-medium">10-Day Trial</span>
                                                        )}
                                                        {isTrialDisabled && <span className="text-[10px] sm:text-xs text-slate-400 font-medium">(Already Used)</span>}
                                                        {!isTrialVariant && (
                                                            <span className="text-[10px] sm:text-xs text-amber-600/70 font-medium">₹{variants[v].price} • Free Delivery</span>
                                                        )}
                                                    </div>
                                                </div>
                                                {isSelected && !isTrialDisabled && <CheckCircle className="w-5 h-5 relative z-10 shrink-0 text-amber-600" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <button
                                onClick={() => setOpen(true)}
                                className={`mt-6 sm:mt-10 w-full py-3.5 sm:py-5 rounded-2xl font-bold text-base sm:text-lg shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] transform transition-all active:scale-[0.98] hover:-translate-y-1 flex items-center justify-center gap-3 group relative overflow-hidden ${isFreeVariant
                                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-900'
                                    : 'bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white'
                                    }`}
                            >
                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isFreeVariant
                                    ? 'bg-gradient-to-r from-yellow-400/30 to-amber-400/30'
                                    : 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20'
                                    }`} />
                                <span className="relative z-10">{isFreeVariant ? '🎁 Get Free Trial Now' : 'Secure Checkout Now'}</span>
                                {isFreeVariant
                                    ? <Gift className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                                    : <ShoppingCart className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                                }
                            </button>

                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 mt-6 text-sm font-medium text-slate-500">
                                <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-amber-500" /> 4K+ bought in past month</span>
                                <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-amber-500" /> Trusted Product</span>
                                <span className="flex items-center gap-1.5"><ShoppingCart className="w-4 h-4 text-amber-500" /> Fast Delivery</span>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* VIDEOS SECTION */}
                <div className="mt-12 sm:mt-16">
                    <div className="flex items-center gap-3 mb-6 sm:mb-8 justify-center sm:justify-start">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
                            <Play className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 ml-1" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900">Real Transformations</h2>
                    </div>

                    {/* Horizontal Scroller */}
                    <div className="flex overflow-x-auto gap-4 sm:gap-6 pb-6 px-1 snap-x snap-mandatory custom-scrollbar">
                        {videos.map((vid) => (
                            <VideoCard key={vid.id} vid={vid} />
                        ))}
                    </div>
                </div>

                {/* BEFORE & AFTER RESULTS SECTION */}
                <section className="mt-12 sm:mt-16">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-3 sm:mb-4">
                            Before & After Results
                        </h2>
                        <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
                            Real customers, real transformations. See the incredible difference MULTIVITAZ Hair Grow+ has made.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                        {[
                            { before: "/images/ba1.png", after: "/images/ba2.png", name: "Rahul M.", duration: "8 Weeks", rating: 5 },
                            { before: "/images/ba3.png", after: "/images/ba4.png", name: "Riva K.", duration: "12 Weeks", rating: 5 },
                            { before: "/images/ba5.png", after: "/images/ba6.png", name: "Vikram S.", duration: "6 Weeks", rating: 4 },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="bg-white rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:border-amber-200 transition-all duration-500 group"
                            >
                                {/* Images Row */}
                                <div className="relative flex">
                                    {/* Before */}
                                    <div className="w-1/2 relative overflow-hidden">
                                        <img
                                            src={item.before}
                                            alt={`Before - ${item.name}`}
                                            className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                        <span className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-red-500/90 backdrop-blur-sm text-white text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-lg">
                                            Before
                                        </span>
                                    </div>

                                    {/* Divider */}
                                    <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[3px] bg-white z-10 shadow-lg" />
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-xl flex items-center justify-center border-2 border-amber-400">
                                        <RefreshCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
                                    </div>

                                    {/* After */}
                                    <div className="w-1/2 relative overflow-hidden">
                                        <img
                                            src={item.after}
                                            alt={`After - ${item.name}`}
                                            className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                        <span className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-amber-500/90 backdrop-blur-sm text-white text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-lg">
                                            After
                                        </span>
                                    </div>
                                </div>

                                {/* Card Footer */}
                                <div className="p-4 sm:p-5">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-bold text-slate-900 text-sm sm:text-base">{item.name}</h3>
                                        <span className="bg-amber-50 text-amber-700 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full border border-amber-200 flex items-center gap-1">
                                            <Activity className="w-3 h-3" />
                                            {item.duration}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {[...Array(item.rating)].map((_, idx) => (
                                            <Star key={idx} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                        ))}
                                        {[...Array(5 - item.rating)].map((_, idx) => (
                                            <Star key={idx} className="w-3.5 h-3.5 text-slate-200" />
                                        ))}
                                        <span className="text-[10px] sm:text-xs text-slate-400 ml-1 font-medium">Verified Result</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Bottom CTA for this section */}
                    <div className="mt-8 sm:mt-10 text-center">
                        <p className="text-slate-500 text-xs sm:text-sm mb-4 font-medium">Results may vary. Individual experiences differ based on usage and consistency.</p>
                        <button
                            onClick={() => setOpen(true)}
                            className="inline-flex items-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-700 px-6 py-3 rounded-xl font-bold transition-colors border border-amber-200 text-sm sm:text-base"
                        >
                            <Sparkles className="w-4 h-4" />
                            Start Your Transformation
                        </button>
                    </div>
                </section>

                {/* CONTENT SECTIONS */}
                <div className="mt-12 sm:mt-16 grid lg:grid-cols-3 gap-8">

                    {/* MAIN CONTENT (LEFT) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* WHY CHOOSE US */}
                        <section className="bg-white rounded-[2rem] p-6 sm:p-8 md:p-10 shadow-sm border border-slate-100/50">
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-6 sm:mb-8 flex items-center gap-3 leading-tight">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
                                    <Star className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                                </div>
                                Why Choose MULTIVITAZ Hair Grow+?
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-4 text-left">
                                {[
                                    { text: "Biotin Advance Formula", icon: Leaf },
                                    { text: "18 Essential Amino Acids", icon: Activity },
                                    { text: "Rich Vitamins & Minerals", icon: Droplets },
                                    { text: "Clinically Supports Growth", icon: ShieldCheck },
                                    { text: "100% Vegetarian Formula", icon: CheckCircle },
                                    { text: "Sugar & Gluten Free", icon: Award },
                                    { text: "Dermatologically Tested", icon: ShieldCheck },
                                    { text: "No Artificial Colors", icon: Sparkles },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-amber-200 transition-colors group gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                            <item.icon className="w-5 h-5 text-amber-500" />
                                        </div>
                                        <span className="font-bold text-slate-800 text-sm sm:text-base leading-tight">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* POWER-PACKED INGREDIENTS */}
                        <section className="bg-gradient-to-br from-[#1a0e00] via-[#2d1800] to-[#0f0800] text-white rounded-[2rem] p-6 sm:p-8 md:p-10 shadow-xl overflow-hidden relative">
                            <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-amber-500/20 blur-3xl rounded-full pointer-events-none" />

                            <h2 className="text-2xl md:text-3xl font-extrabold mb-6 sm:mb-8 flex items-center gap-3">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md shrink-0">
                                    <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
                                </div>
                                Power-Packed Ingredients
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10 text-left">
                                {[
                                    { name: "Biotin (Vitamin B7)", desc: "Supports strong, thick & healthy hair growth", icon: "💊" },
                                    { name: "Amino Acids Blend", desc: "Helps in keratin production & reduces hair breakage", icon: "🧬" },
                                    { name: "Vitamin C", desc: "Boosts collagen & improves scalp health", icon: "🍊" },
                                    { name: "Vitamin E", desc: "Promotes blood circulation for hair follicles", icon: "✨" },
                                    { name: "Folic Acid (Vitamin B9)", desc: "Supports cell regeneration & hair strength", icon: "🧪" },
                                    { name: "Zinc", desc: "Controls hair fall & maintains scalp oil balance", icon: "🧂" },
                                    { name: "Calcium", desc: "Strengthens hair roots", icon: "🦴" },
                                    { name: "Selenium", desc: "Protects hair from oxidative damage", icon: "🔬" },
                                    { name: "Soy Isoflavones", desc: "Helps improve hair density & thickness", icon: "🌱" },
                                    { name: "Grape Seed Extract", desc: "Rich in antioxidants for healthier scalp", icon: "🍇" }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                                        <div className="text-2xl sm:text-3xl shrink-0 group-hover:scale-110 transition-transform">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h4 className="text-amber-400 font-bold text-sm sm:text-base leading-tight mb-1">{item.name}</h4>
                                            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* SIDEBAR (RIGHT) */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* HOW TO USE */}
                        <section className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-[2rem] p-6 sm:p-8 shadow-sm border border-amber-100">
                            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 text-amber-600 border border-amber-100">
                                    <Info className="w-4 h-4" />
                                </div>
                                How To Use
                            </h2>
                            <ul className="space-y-4">
                                {[
                                    { icon: Plus, text: "1 tablet daily or as directed by Dietician" },
                                    { icon: Info, text: "Store below 25°C in a dry place" },
                                    { icon: CheckCircle, text: "Pack contains 30 ready-to-use tablets" },
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-4 items-start">
                                        <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 text-amber-600 border border-amber-100">
                                            <item.icon className="w-4 h-4" />
                                        </div>
                                        <span className="text-slate-700 font-medium pt-1 leading-tight text-sm sm:text-base">{item.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* REAL RESULTS (REVIEWS) */}
                        <section className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100/50 flex flex-col h-[600px] lg:h-[750px]">
                            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                                Real Results
                            </h2>
                            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1 overscroll-contain">
                                {[
                                    { name: "Rahul Sharma", text: "Hair fall reduced in 2 weeks! Very impressive formula.", time: "2 days ago", rating: 5 },
                                    { name: "Priya Patel", text: "Amazing results! Highly recommend to everyone struggling.", time: "5 days ago", rating: 5 },
                                    { name: "Manoj Singh", text: "Using it for a month now, can see small baby hairs growing.", time: "1 week ago", rating: 5 },
                                    { name: "Sneha Rao", text: "Best hair supplement I have tried so far. No side effects.", time: "1 week ago", rating: 5 },
                                    { name: "Vikram Gupta", text: "My hair feels much thicker and stronger than before.", time: "2 weeks ago", rating: 4 },
                                    { name: "Ananya Jain", text: "Consistency is key. Seeing great results after 2 months.", time: "2 weeks ago", rating: 5 },
                                    { name: "Deepak Kumar", text: "Stopped my hair fall completely in just 3 weeks.", time: "3 weeks ago", rating: 5 },
                                    { name: "Megha Verma", text: "Scalp feels healthier and hair has a natural shine.", time: "3 weeks ago", rating: 4 },
                                    { name: "Rohit Joshi", text: "Worth every penny. Quality is top-notch.", time: "1 month ago", rating: 5 },
                                    { name: "Kavita Reddy", text: "Results are slow but visible. Giving it 5 stars for the quality.", time: "1 month ago", rating: 5 },
                                    { name: "Aniket Deshmukh", text: "Finally found something that actually works for my thinning hair.", time: "1 month ago", rating: 5 },
                                    { name: "Swati Kulkarni", text: "Helped me recover from postpartum hair loss. Truly a lifesaver.", time: "1 month ago", rating: 5 },
                                    { name: "Arjun Malhotra", text: "Great product! My friends are also asking about my hair secret.", time: "2 months ago", rating: 4 },
                                    { name: "Neha Kapoor", text: "I can see the difference in my hair density already.", time: "2 months ago", rating: 5 },
                                    { name: "Rajesh Iyer", text: "Highly effective formula. The biotin levels are perfect.", time: "2 months ago", rating: 5 },
                                    { name: "Aarti Sharma", text: "Amazing experience. The support team is also very helpful.", time: "2 months ago", rating: 5 },
                                    { name: "Sunil Grover", text: "Results exceeded my expectations. 10/10 would buy again.", time: "3 months ago", rating: 5 },
                                    { name: "Pooja Hegde", text: "Definitely seeing improvement in my hair texture.", time: "3 months ago", rating: 4 },
                                    { name: "Harish Rawat", text: "No more hair on my pillow! So happy with MULTIVITAZ.", time: "3 months ago", rating: 5 },
                                    { name: "Mehra G.", text: "The best investment for my hair health.", time: "3 months ago", rating: 5 },
                                    { name: "Akash B.", text: "Clinical grade quality that you can actually feel.", time: "4 months ago", rating: 5 },
                                    { name: "Shruti L.", text: "Highly recommend for anyone dealing with seasonal hair fall.", time: "4 months ago", rating: 5 },
                                    { name: "Vinay S.", text: "My hair growth has accelerated noticeably.", time: "4 months ago", rating: 4 },
                                    { name: "Nisha D.", text: "Roots feel much stronger. Less breakage during combing.", time: "5 months ago", rating: 5 },
                                    { name: "Vivek T.", text: "A must-have for healthy hair. Very satisfied with the product.", time: "5 months ago", rating: 5 },
                                ].map((r, i) => (
                                    <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50 hover:border-amber-200 transition-colors">
                                        <div className="flex gap-1 mb-2">
                                            {[...Array(5)].map((_, idx) => (
                                                <Star key={idx} className={`w-3 h-3 ${idx < r.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
                                            ))}
                                        </div>
                                        <p className="text-slate-700 text-sm italic mb-3">"{r.text}"</p>
                                        <div className="flex items-center justify-between text-[10px] sm:text-xs">
                                            <span className="font-bold text-slate-900">{r.name}</span>
                                            <span className="text-slate-400">{r.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>

                {/* HOW TO ORDER SECTION */}
                <section className="mt-12 sm:mt-16">
                    <div className="text-center mb-8 sm:mb-12">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 mb-4 shadow-sm border border-amber-200">
                            <ShoppingCart className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4">
                            How to Order
                        </h2>
                        <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
                            Follow these simple steps to get your MULTIVITAZ Hair Grow+ delivered straight to your door.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8 relative">
                        {/* Connecting Line for Desktop */}
                        <div className="hidden md:block absolute top-[45px] left-[15%] right-[15%] h-0.5 bg-amber-100 -z-10" />

                        {[
                            { step: 1, title: "Select Package", desc: "Choose between our 30 or 60 tablets package.", icon: CheckCircle },
                            { step: 2, title: "Place Order", desc: "Click on the Secure Checkout or Buy Now button.", icon: ShoppingCart },
                            { step: 3, title: "Fill Details", desc: "Enter delivery details and pick a payment method (UPI / COD).", icon: MapPin },
                            { step: 4, title: "Get Delivery", desc: "Receive your order quickly and start your hair growth journey.", icon: Truck },
                        ].map((item, i) => (
                            <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:border-amber-200 transition-all flex flex-col items-center text-center group relative mt-6 md:mt-0 hover:-translate-y-1">
                                <div className="absolute -top-6 w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-amber-500/30 border-4 border-[#fdf8f0] group-hover:scale-110 transition-transform">
                                    {item.step}
                                </div>
                                <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mt-4 mb-4 group-hover:bg-amber-100 transition-colors">
                                    <item.icon className="w-7 h-7 text-amber-600" />
                                </div>
                                <h3 className="font-bold text-slate-900 text-lg mb-2">{item.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* OUR PROMISE SECTION */}
                <section className="mt-12 sm:mt-16">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-slate-900 mb-8 sm:mb-12">
                        Our Promise To You
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                        {[
                            { icon: RefreshCcw, title: "7 Days Return", desc: "Easy returns policy" },
                            { icon: Award, title: "Made in India", desc: "Proudly manufactured" },
                            { icon: Truck, title: "Express Delivery", desc: "Fast & reliable" },
                            { icon: Banknote, title: "COD Available", desc: "Pay on delivery" },
                            { icon: Headset, title: "24/7 Support", desc: "Always here for you" },
                            { icon: ShieldCheck, title: "GMP Certified", desc: "Good Manufacturing Practice" },
                            { icon: CheckCircle, title: "Assured Quality", desc: "100% quality tested" },
                            { icon: Award, title: "FSSAI Certified", desc: "Food safety approved" },
                        ].map((item, i) => (
                            <div key={i} className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 hover:border-amber-200 transition-colors flex flex-col items-center text-center group">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <item.icon className="w-6 h-6 sm:w-7 sm:h-7 text-amber-600" />
                                </div>
                                <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1">{item.title}</h3>
                                <p className="text-xs sm:text-sm text-slate-500">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* NEED HELP SECTION */}
                <section className="mt-12 sm:mt-16">
                    <div className="bg-white rounded-[2rem] p-6 sm:p-8 md:p-10 shadow-sm border border-slate-100/50 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2 flex items-center gap-3">
                                <LifeBuoy className="w-8 h-8 text-amber-500" />
                                Need Help?
                            </h2>
                            <p className="text-slate-600 text-sm sm:text-base max-w-md">
                                We are here to assist you with your queries. Reach out to us directly for any assistance with your purchase.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-700 px-6 py-3 rounded-xl font-bold transition-colors">
                                <MessageCircle className="w-5 h-5" />
                                WhatsApp Us
                            </a>
                            <a href="mailto:support@multivitaz.com" className="flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 px-6 py-3 rounded-xl font-bold transition-colors border border-slate-200">
                                <Mail className="w-5 h-5" />
                                Email Support
                            </a>
                        </div>
                    </div>
                </section>

                {/* EDITORIAL BENEFITS SECTION */}
                <section className="mt-12 sm:mt-16 overflow-hidden">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6">
                        {/* Intro Header */}
                        <div className="mb-12 sm:mb-16 text-center">
                            <h2 className="text-4xl sm:text-6xl font-black text-slate-900 leading-tight tracking-tight">
                                Transform Your Hair <br className="hidden sm:block" />
                                <span className="text-amber-500 italic font-serif">The Natural Way.</span>
                            </h2>
                            <div className="w-24 h-1 bg-amber-500 mx-auto mt-8 rounded-full" />
                        </div>

                        <div className="space-y-10 sm:space-y-12">
                            {/* Block 1: Image Left, Text Right */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-24 items-center">
                                <motion.div
                                    initial={{ opacity: 0, x: -50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8 }}
                                    className="relative"
                                >
                                    <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl relative z-10">
                                        <img src="/images/male_phase_1.png" alt="Deep Root Nourishment" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-amber-100 rounded-full blur-3xl -z-10 opacity-60" />
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    className="space-y-6 sm:space-y-8 text-left"
                                >
                                    <div className="inline-block px-4 py-1.5 bg-amber-50 text-amber-700 text-xs sm:text-sm font-bold rounded-full uppercase tracking-widest border border-amber-100">
                                        Phase 01: Activation
                                    </div>
                                    <h3 className="text-3xl sm:text-5xl font-black text-slate-900 leading-[1.1]">
                                        Deep Root <br />
                                        <span className="text-amber-500 font-serif italic font-normal text-4xl sm:text-5xl">Nourishment.</span>
                                    </h3>
                                    <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-md">
                                        Clinical research shows that healthy hair starts at the follicle. Our advanced blend of 18 Amino Acids and Biotin penetrates deep, delivering life-giving nutrients where they matter most.
                                    </p>
                                    <ul className="space-y-4">
                                        {[
                                            "3x Faster Nutrient Absorption",
                                            "Biotin-Infused Root Care",
                                            "Scalp Microbiome Support"
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 text-slate-900 font-bold text-sm sm:text-base">
                                                <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center shrink-0">
                                                    <CheckCircle className="w-3.5 h-3.5 text-white" />
                                                </div>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            </div>

                            {/* Block 2: Text Left, Image Right */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-24 items-center">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    className="space-y-6 sm:space-y-8 lg:order-1 order-2 text-left"
                                >
                                    <div className="inline-block px-4 py-1.5 bg-amber-50 text-amber-700 text-xs sm:text-sm font-bold rounded-full uppercase tracking-widest border border-amber-100">
                                        Phase 02: Resilience
                                    </div>
                                    <h3 className="text-3xl sm:text-5xl font-black text-slate-900 leading-[1.1]">
                                        Unrivaled Hair <br />
                                        <span className="text-amber-500 font-serif italic font-normal text-4xl sm:text-5xl">Resilience.</span>
                                    </h3>
                                    <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-md">
                                        Experience up to 90% reduction in hair fall. MULTIVITAZ Hair Grow+ doesn't just grow new hair; it anchors existing strands with clinical-grade strength for a thicker mane.
                                    </p>
                                    <ul className="space-y-4">
                                        {[
                                            "90% Less Hair Fall Reported",
                                            "Thicker, Stronger Shafts",
                                            "Natural Shine & Texture"
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 text-slate-900 font-bold text-sm sm:text-base">
                                                <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center shrink-0">
                                                    <CheckCircle className="w-3.5 h-3.5 text-white" />
                                                </div>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, x: 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8 }}
                                    className="relative lg:order-2 order-1"
                                >
                                    <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl relative z-10">
                                        <img src="/images/result2.png" alt="Unrivaled Hair Strength" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="absolute -top-8 -right-8 w-64 h-64 bg-amber-100 rounded-full blur-3xl -z-10 opacity-60" />
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ ACCORDION SECTION */}
                <section className="mt-12 sm:mt-16">
                    <div className="text-center mb-8 sm:mb-12">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 mb-4 shadow-sm border border-amber-200">
                            <MessageCircle className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-3 sm:mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
                            Everything you need to know about MULTIVITAZ Hair Grow+.
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4">
                        {[
                            { q: "What is MULTIVITAZ Hair Grow+?", a: "MULTIVITAZ Hair Grow+ is a clinically formulated advanced hair growth supplement containing Biotin, 18 essential amino acids, vitamins, and minerals that work together to promote thicker, stronger, and healthier hair growth from within." },
                            { q: "How long does it take to see results?", a: "Most users start noticing visible improvements within 4–6 weeks of consistent daily use. For best results, we recommend a minimum course of 8–12 weeks. Individual results may vary based on hair condition and consistency of use." },
                            { q: "Are there any side effects?", a: "MULTIVITAZ Hair Grow+ is made with 100% natural, clinically-tested ingredients and is FSSAI certified. It has no known side effects when taken as directed. However, if you have specific allergies or medical conditions, we recommend consulting your physician before use." },
                            { q: "How should I take MULTIVITAZ Hair Grow+?", a: "Take 1 tablet daily after a meal with water, or as directed by your dietician or healthcare professional. Do not exceed the recommended dosage. Store below 25°C in a cool, dry place." },
                            { q: "Is the free trial really free? What's the catch?", a: "Yes, the free trial is absolutely free with ₹0 product cost! We offer a 10-day trial so you can experience the product quality first-hand. This offer is limited to one per customer." },
                            { q: "What payment methods do you accept?", a: "We accept UPI payments, and also offer Cash on Delivery (COD) for your convenience. For online payments, we use Razorpay's secure payment gateway to ensure your transaction is safe and protected." },
                            { q: "What are the key ingredients?", a: "Our formula includes Biotin, Vitamin C, Vitamin E, Niacinamide, Folic Acid, Calcium Pantothenate, along with essential minerals like Zinc, Iron, Selenium, Calcium, and Magnesium. It also features 18 essential amino acids, Soya Isoflavones, and Grape Seed Extract." },
                            { q: "Is MULTIVITAZ suitable for both men and women?", a: "Yes! MULTIVITAZ Hair Grow+ is specially formulated to work effectively for both men and women experiencing hair thinning, hair fall, or slow hair growth. The nutrients address common deficiencies that affect hair health in all genders." },
                            { q: "How many tablets are in each pack?", a: "We offer two pack sizes — 30 tablets (1-month supply) and 60 tablets (2-month supply). The 60-tablet pack offers better value per tablet. We also offer a free 10-day trial so you can try before committing." },
                            { q: "What is your return policy?", a: "We offer a hassle-free 7-day return policy. If you are not satisfied with the product for any reason, you can initiate a return within 7 days of delivery. Simply contact our support team via WhatsApp or email." },
                            { q: "Is MULTIVITAZ GMP and FSSAI certified?", a: "Yes, MULTIVITAZ Hair Grow+ is manufactured in a GMP-certified facility and is FSSAI approved. We adhere to the highest quality standards to ensure every tablet meets strict safety and efficacy requirements." },
                            { q: "How will my order be delivered?", a: "We ship across India via trusted courier partners. Orders are typically dispatched within 24–48 hours and delivered within 5–7 business days depending on your location. You will receive a tracking update once your order is shipped." },
                        ].map((item, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-slate-100 hover:border-amber-200 transition-all overflow-hidden shadow-sm">
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left group"
                                >
                                    <span className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-amber-700 transition-colors">{item.q}</span>
                                    <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-amber-500' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {openFaq === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
                                                <div className="border-t border-slate-100 pt-4">
                                                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{item.a}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CONTACT FAQ SECTION */}
                <section className="mt-16 sm:mt-24 mb-6">
                    <div className="bg-gradient-to-br from-[#1a0e00] via-[#2d1800] to-[#0f0800] p-6 sm:p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none transform translate-x-1/3 -translate-y-1/3" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none transform -translate-x-1/3 translate-y-1/3" />

                        <div className="text-center mb-8 sm:mb-10 relative z-10">
                            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-500/20 text-amber-400 mb-5 sm:mb-6 backdrop-blur-sm border border-amber-500/30">
                                <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8" />
                            </div>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                                Still Have Questions?
                            </h2>
                            <p className="text-amber-100/70 mt-3 text-base sm:text-lg font-medium max-w-sm mx-auto">
                                Connect with our experts directly on WhatsApp
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 relative z-10 max-w-5xl mx-auto">
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-amber-400 transition-colors" />
                                <input
                                    placeholder="Your Name"
                                    value={faqForm.name}
                                    onChange={(e) => setFaqForm({ ...faqForm, name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 focus:bg-white/10 transition-all rounded-xl sm:rounded-2xl py-3.5 sm:py-4 pl-12 pr-4 backdrop-blur-sm text-sm sm:text-base"
                                />
                            </div>

                            <div className="relative group">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-amber-400 transition-colors" />
                                <input
                                    placeholder="Mobile Number"
                                    value={faqForm.mobile}
                                    onChange={(e) => setFaqForm({ ...faqForm, mobile: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 focus:bg-white/10 transition-all rounded-xl sm:rounded-2xl py-3.5 sm:py-4 pl-12 pr-4 backdrop-blur-sm text-sm sm:text-base"
                                />
                            </div>

                            <div className="relative group">
                                <Info className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-amber-400 transition-colors" />
                                <input
                                    placeholder="What do you want to ask?"
                                    value={faqForm.question}
                                    onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 focus:bg-white/10 transition-all rounded-xl sm:rounded-2xl py-3.5 sm:py-4 pl-12 pr-4 backdrop-blur-sm text-sm sm:text-base"
                                />
                            </div>

                            <button
                                onClick={handleFaqSubmit}
                                className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-900 font-bold py-3.5 sm:py-4 rounded-xl sm:rounded-2xl shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 text-sm sm:text-base"
                            >
                                Ask on WhatsApp <MessageCircle className="w-5 h-5 fill-slate-900" />
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            {/* FOOTER & COMPLIANCE SECTION */}
            <footer className="bg-slate-900 border-t border-white/5 pt-16 pb-32 sm:pb-32 relative z-30">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                        {/* Brand Column */}
                        <div className="lg:col-span-2">
                            <div className="text-2xl font-black text-white mb-6">
                                MULTI<span className="text-amber-500">VITAZ</span>
                            </div>
                            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-sm mb-8">
                                Developed by {BUSINESS_NAME}, MULTIVITAZ Hair Grow+ is your premium solution for advanced hair care, formulated with clinical-grade ingredients for real results.
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-amber-500">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-amber-500">
                                    <Award className="w-5 h-5" />
                                </div>
                                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-amber-500">
                                    <Zap className="w-5 h-5" />
                                </div>
                            </div>

                            <div className="mt-8">
                                <h4 className="text-white font-bold mb-4 text-sm">Follow Us</h4>
                                <div className="flex items-center gap-4">
                                    <a href="https://www.instagram.com/multivitaz?igsh=M2p5bWY3MWRoYnMz" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-0.5 group">
                                        <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-white group-hover:bg-transparent transition-all">
                                            <InstagramIcon className="w-5 h-5" />
                                        </div>
                                    </a>
                                    <a href="https://www.facebook.com/share/18QJ3X2aCc/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-[#1877F2] p-0.5 group">
                                        <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-white group-hover:bg-transparent transition-all">
                                            <FacebookIcon className="w-5 h-5" />
                                        </div>
                                    </a>
                                    <a href="https://wa.me/message/MQHDA4QXNRFAG1" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-[#25D366] p-0.5 group">
                                        <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-white group-hover:bg-transparent transition-all">
                                            <WhatsAppIcon className="w-5 h-5" />
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-white font-bold mb-6">Policies</h3>
                            <ul className="space-y-4">
                                <li>
                                    <button onClick={() => setShowPolicy('privacy')} className="text-slate-400 hover:text-amber-500 transition-colors text-sm">Privacy Policy</button>
                                </li>
                                <li>
                                    <button onClick={() => setShowPolicy('terms')} className="text-slate-400 hover:text-amber-500 transition-colors text-sm">Terms & Conditions</button>
                                </li>
                                <li>
                                    <button onClick={() => setShowPolicy('refund')} className="text-slate-400 hover:text-amber-500 transition-colors text-sm">Refund & Cancellation</button>
                                </li>
                                <li>
                                    <button onClick={() => setShowPolicy('shipping')} className="text-slate-400 hover:text-amber-500 transition-colors text-sm">Shipping & Delivery</button>
                                </li>
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <h3 className="text-white font-bold mb-6">Contact Us</h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-slate-400 text-sm">
                                    <MapPin className="w-5 h-5 text-amber-500 shrink-0" />
                                    <span>{OFFICE_ADDRESS}</span>
                                </li>
                                <li className="flex gap-3 text-slate-400 text-sm">
                                    <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                                    <span>{SUPPORT_EMAIL}</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-slate-500 text-xs sm:text-sm">
                            © {new Date().getFullYear()} {BUSINESS_NAME}. All rights reserved.
                        </p>
                        <p className="text-slate-600 text-[10px] sm:text-xs">
                            Product results may vary from person to person.
                        </p>
                    </div>
                </div>
            </footer>


            {/* STICKY BOTTOM ACTION */}
            <div className={`fixed bottom-0 left-0 w-full backdrop-blur-xl border-t p-3 sm:p-4 z-40 transform translate-y-0 shadow-[0_-10px_30px_rgb(0,0,0,0.08)] ${isFreeVariant ? 'bg-amber-50/95 border-amber-200/50' : 'bg-white/90 border-amber-100/50'}`}>
                <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 px-1 sm:px-2">
                    <div className="hidden sm:block">
                        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{isFreeVariant ? 'Free Trial' : 'Total Price'}</p>
                        <p className={`font-black text-2xl ${isFreeVariant ? 'text-amber-600' : 'text-slate-900'}`}>{isFreeVariant ? 'FREE ₹0' : `₹${total}`}</p>
                    </div>
                    <div className="sm:hidden flex flex-col justify-center">
                        <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{isFreeVariant ? 'Free Trial' : 'Total'}</span>
                        <span className={`font-black text-xl leading-none ${isFreeVariant ? 'text-amber-600' : 'text-slate-900'}`}>{isFreeVariant ? 'FREE' : `₹${total}`}</span>
                    </div>

                    <button
                        onClick={() => setOpen(true)}
                        className={`px-6 sm:px-8 py-3 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg shadow-lg transition-all active:scale-95 flex items-center gap-2 flex-1 sm:flex-none justify-center ${isFreeVariant
                            ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-900 shadow-amber-500/30'
                            : 'bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white shadow-amber-600/30'
                            }`}
                    >
                        {isFreeVariant ? '🎁 Get Free Trial' : 'Buy Now'}
                        {isFreeVariant ? <Gift className="w-4 h-4 sm:w-5 sm:h-5" /> : <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </button>
                </div>
            </div>

            {/* ORDER MODAL */}
            <AnimatePresence>
                {open && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]"
                            onClick={() => setOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 100, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 100, scale: 0.95 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed inset-x-0 bottom-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full md:max-w-xl z-[70] bg-white rounded-t-[2rem] md:rounded-[2.5rem] p-5 sm:p-6 shadow-2xl overflow-y-auto max-h-[85vh] custom-scrollbar"
                        >
                            {/* FREE TRIAL BANNER */}
                            {isFreeVariant && (
                                <div className="mb-5 bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 rounded-2xl p-4 sm:p-5 text-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2220%22 height=%2220%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Ccircle cx=%2210%22 cy=%2210%22 r=%221.5%22 fill=%22rgba(255,255,255,0.3)%22/%3E%3C/svg%3E')] pointer-events-none" />
                                    <div className="relative z-10">
                                        <div className="text-3xl mb-1">🎁</div>
                                        <h3 className="text-lg sm:text-xl font-black text-amber-900">FREE 10-DAY TRIAL!</h3>
                                        <p className="text-amber-800 text-xs sm:text-sm font-semibold mt-1">Try MULTIVITAZ free for 10 days — only pay ₹{deliveryCharge} delivery charge!</p>
                                        <div className="mt-2 inline-flex items-center gap-1.5 bg-white/40 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-amber-900">
                                            <Timer className="w-3.5 h-3.5" /> 10-Day Trial • Limited Time
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-between mb-6 sm:mb-8 pb-4 border-b border-slate-100">
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">{isFreeVariant ? '🎁 Claim Free Trial' : 'Complete Purchase'}</h2>
                                    <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">{isFreeVariant ? 'Fill in delivery details to receive your free trial.' : 'Fill in details for swift delivery.'}</p>
                                </div>
                                <button
                                    onClick={() => setOpen(false)}
                                    className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-500 transition-colors"
                                >
                                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:gap-4">
                                <div className="space-y-3 sm:space-y-4">
                                    <div className="relative group">
                                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 transition-colors group-focus-within:text-amber-500" />
                                        <input placeholder="Full Name" className="w-full pl-10 sm:pl-11 pr-4 py-3 sm:py-3.5 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl outline-none transition-all font-medium text-sm sm:text-base" onChange={(e) => setForm({ ...form, name: e.target.value })} />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                        <div className="relative group">
                                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 transition-colors group-focus-within:text-amber-500" />
                                            <input placeholder="Mobile Number" className="w-full pl-10 sm:pl-11 pr-4 py-3 sm:py-3.5 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl outline-none transition-all font-medium text-sm sm:text-base" onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
                                        </div>
                                        <div className="relative group">
                                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 transition-colors group-focus-within:text-amber-500" />
                                            <input placeholder="Email Address" className="w-full pl-10 sm:pl-11 pr-4 py-3 sm:py-3.5 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl outline-none transition-all font-medium text-sm sm:text-base" onChange={(e) => setForm({ ...form, email: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="relative group">
                                        <MapPin className="absolute left-3.5 top-[14px] sm:top-4 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 transition-colors group-focus-within:text-amber-500" />
                                        <textarea placeholder="Complete Address" rows={2} className="w-full pl-10 sm:pl-11 pr-4 py-3 sm:py-3.5 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl outline-none transition-all font-medium resize-none text-sm sm:text-base" onChange={(e) => setForm({ ...form, address: e.target.value })} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                        <div className="relative group">
                                            <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 transition-colors group-focus-within:text-amber-500" />
                                            <input placeholder="City" className="w-full pl-10 sm:pl-11 pr-3 sm:pr-4 py-3 sm:py-3.5 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl outline-none transition-all font-medium text-sm sm:text-base" onChange={(e) => setForm({ ...form, city: e.target.value })} />
                                        </div>
                                        <div className="relative group">
                                            <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 transition-colors group-focus-within:text-amber-500" />
                                            <input placeholder="Pincode" className="w-full pl-10 sm:pl-11 pr-3 sm:pr-4 py-3 sm:py-3.5 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl outline-none transition-all font-medium text-sm sm:text-base" onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 sm:mt-8 bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-100">
                                {isFreeVariant ? (
                                    /* FREE TRIAL – 10 Days with delivery charge */
                                    <>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="font-bold text-slate-700 text-sm sm:text-base">Package</span>
                                            <span className="text-sm sm:text-base font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-lg">
                                                Free Trial – 10 Days
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="font-bold text-slate-700 text-sm sm:text-base">Quantity</span>
                                            <span className="text-sm sm:text-base font-black text-slate-900">1</span>
                                        </div>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="font-bold text-slate-700 text-sm sm:text-base">Product Price</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm line-through text-slate-400">₹{oldPrice}</span>
                                                <span className="text-sm sm:text-base font-bold text-amber-600 flex items-center gap-1"><Gift className="w-4 h-4" /> FREE</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="font-bold text-slate-700 text-sm sm:text-base flex items-center gap-1.5"><Truck className="w-4 h-4 text-amber-600" /> Delivery Charge</span>
                                            <span className="text-sm sm:text-base font-black text-amber-700">₹{deliveryCharge}</span>
                                        </div>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="font-bold text-slate-700 text-sm sm:text-base">Payment</span>
                                            <span className="text-sm sm:text-base font-bold text-amber-600 flex items-center gap-1"><Zap className="w-4 h-4" /> Online Payment (Prepaid)</span>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
                                            <p className="text-slate-500 font-semibold text-sm sm:text-base">Total Payable</p>
                                            <div className="flex flex-col items-end">
                                                <p className="text-2xl sm:text-3xl font-black text-amber-700">₹{deliveryCharge}</p>
                                                <p className="text-[10px] sm:text-xs text-slate-400 font-medium mt-0.5">Only delivery charge</p>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    /* PAID VARIANT – Normal flow */
                                    <>
                                        {/* PREPAID BONUS INFO */}
                                        {payment === 'upi' ? (
                                            <div className="mb-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
                                                <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/30">
                                                    <Zap className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-amber-900 font-black text-sm uppercase tracking-wider">Prepaid Order Bonus</p>
                                                    <p className="text-amber-700 text-xs font-bold leading-tight mt-0.5">
                                                        ₹599+ Get Extra 10% Off | ₹1199+ Get Extra 15% Off
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="mb-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start gap-3 opacity-80">
                                                <div className="w-10 h-10 rounded-xl bg-slate-300 flex items-center justify-center shrink-0">
                                                    <Zap className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-slate-600 font-bold text-sm">Switch to UPI/Online</p>
                                                    <p className="text-slate-500 text-xs">Unlock up to 15% Extra Savings on your order.</p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between mb-3 leading-tight">
                                            <span className="font-bold text-slate-700 text-sm sm:text-base">Package Selection</span>
                                            <span className="text-xs sm:text-sm font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                                                {payment === 'upi' ? 'Prepaid Order' : 'COD Order'} {selectedVariant.label}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="font-bold text-slate-700 text-sm sm:text-base">Quantity</span>
                                            <div className="flex items-center gap-2 sm:gap-3 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                                                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors">
                                                    <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                                                </button>
                                                <span className="w-5 sm:w-6 text-center font-black text-slate-900 text-sm sm:text-base">{qty}</span>
                                                <button onClick={() => setQty(qty + 1)} className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-50 hover:bg-amber-100 flex items-center justify-center text-amber-600 transition-colors">
                                                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <span className="font-bold text-slate-700 block mb-2 text-sm sm:text-base">Payment Method</span>
                                            <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                                <button
                                                    onClick={() => setPayment("upi")}
                                                    className={`p-2 sm:p-3 rounded-xl border-2 font-bold text-xs sm:text-sm transition-all text-center flex flex-col items-center gap-1 sm:gap-2 ${payment === "upi" ? "border-amber-500 bg-amber-50/50 text-amber-700" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"}`}
                                                >
                                                    <Activity className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" />
                                                    UPI / Online
                                                </button>
                                                {!isFreeVariant && (
                                                    <button
                                                        onClick={() => setPayment("cod")}
                                                        className={`p-2 sm:p-3 rounded-xl border-2 font-bold text-xs sm:text-sm transition-all text-center flex flex-col items-center gap-1 sm:gap-2 ${payment === "cod" ? "border-amber-500 bg-amber-50/50 text-amber-700" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"}`}
                                                    >
                                                        <Building className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" />
                                                        Cash Delivery
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-3.5 bg-slate-100/50 p-4 rounded-2xl border border-slate-100">
                                            <div className="flex items-center justify-between text-sm sm:text-base">
                                                <span className="text-slate-500 font-medium">Cart Subtotal</span>
                                                <span className="font-bold text-slate-900">₹{subtotal}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm sm:text-base">
                                                <span className="text-slate-500 font-medium flex items-center gap-1.5"><Truck className="w-4 h-4 text-amber-500" /> Delivery</span>
                                                <span className="font-bold text-green-600">FREE</span>
                                            </div>

                                            {extraDiscountAmount > 0 && (
                                                <div className="flex items-center justify-between text-sm sm:text-base text-green-600 pt-2 border-t border-slate-200/50">
                                                    <span className="font-bold flex items-center gap-1.5"><Gift className="w-4 h-4" /> Prepaid Discount ({extraDiscountPercent}%)</span>
                                                    <span className="font-black">- ₹{extraDiscountAmount}</span>
                                                </div>
                                            )}

                                            <div className="mt-4 pt-4 border-t-2 border-amber-200 border-dashed flex items-center justify-between">
                                                <div>
                                                    <p className="text-slate-900 font-black text-base sm:text-lg uppercase tracking-tight">Final Payable</p>
                                                    <p className="text-[10px] sm:text-xs text-slate-400 font-medium tracking-wide">FREE COD & Doorstep Delivery</p>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <p className="text-2xl sm:text-4xl font-black text-amber-600 leading-none">₹{total}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <button
                                disabled={!isFormValid || isProcessing}
                                onClick={handleOrder}
                                className={`w-full mt-5 sm:mt-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black text-base sm:text-lg transition-all shadow-[0_10px_20px_-10px_rgba(0,0,0,0.2)] flex items-center justify-center gap-2 ${!isFormValid || isProcessing
                                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                    : isFreeVariant
                                        ? "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-900 hover:-translate-y-1"
                                        : "bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white hover:-translate-y-1"
                                    }`}
                            >
                                {isProcessing ? (
                                    <div className="flex items-center gap-2">
                                        <RefreshCcw className="w-5 h-5 animate-spin" />
                                        <span>Processing...</span>
                                    </div>
                                ) : isFreeVariant ? (
                                    <>
                                        <Gift className={`w-4 h-4 sm:w-5 sm:h-5 ${isFormValid ? "text-slate-900" : ""}`} />
                                        <span>Claim Free Trial</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className={`w-4 h-4 sm:w-5 sm:h-5 ${isFormValid ? "text-amber-300" : ""}`} />
                                        <span className="hidden sm:inline">Confirm Order</span>
                                        <span className="sm:hidden">Confirm</span>
                                        {isFormValid ? ` — ₹${total}` : ""}
                                    </>
                                )}
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* SUCCESS MODAL */}
            <AnimatePresence>
                {success && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[80] flex items-center justify-center p-4"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ type: "spring", damping: 25 }}
                                className="bg-white p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] text-center max-w-sm w-full shadow-2xl relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-amber-100 to-transparent pointer-events-none" />
                                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6 relative z-10">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                    >
                                        <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-amber-600" />
                                    </motion.div>
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 relative z-10">Order Placed!</h2>
                                <p className="text-slate-500 text-sm sm:text-base font-medium leading-relaxed relative z-10">
                                    Thank you for choosing MULTIVITAZ. Your secret to healthier hair is on its way to you!
                                </p>

                                <button
                                    onClick={() => setSuccess(false)}
                                    className="mt-6 sm:mt-8 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-bold w-full py-3.5 sm:py-4 rounded-xl sm:rounded-2xl transition-all shadow-lg active:scale-95 relative z-10"
                                >
                                    Done
                                </button>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ERROR MODAL */}
            <AnimatePresence>
                {paymentError && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[80] flex items-center justify-center p-4"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ type: "spring", damping: 25 }}
                                className="bg-white p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] text-center max-w-sm w-full shadow-2xl relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-red-50 to-transparent pointer-events-none" />
                                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6 relative z-10">
                                    <X className="w-10 h-10 sm:w-12 sm:h-12 text-red-600" />
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 relative z-10">
                                    {paymentError === 'failed' ? 'Payment Failed' : 'Order Incomplete'}
                                </h2>
                                <p className="text-slate-500 text-sm sm:text-base font-medium leading-relaxed relative z-10 px-2">
                                    {paymentError === 'failed'
                                        ? "There was an issue processing your transaction. Please try another payment method."
                                        : "It looks like you didn't finish your payment. To claim your Multivitaz, please complete the order."}
                                </p>

                                <div className="space-y-3 mt-6 sm:mt-8 relative z-10">
                                    <button
                                        onClick={() => {
                                            setPaymentError(null);
                                            setOpen(true);
                                        }}
                                        className="bg-amber-600 hover:bg-amber-500 text-white font-bold w-full py-3.5 rounded-xl sm:rounded-2xl transition-all shadow-lg active:scale-95"
                                    >
                                        Try Again
                                    </button>
                                    <a
                                        href={`https://wa.me/${WHATSAPP_NUMBER}`}
                                        target="_blank"
                                        className="block bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold w-full py-3.5 rounded-xl sm:rounded-2xl transition-all"
                                    >
                                        Need Help?
                                    </a>
                                    <button
                                        onClick={() => setPaymentError(null)}
                                        className="text-slate-400 text-xs font-bold hover:text-slate-600"
                                    >
                                        Close
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* POLICY MODAL */}
            <AnimatePresence>
                {showPolicy && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[90] flex items-center justify-center p-4"
                            onClick={() => setShowPolicy(null)}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="bg-white rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                    <h2 className="text-xl font-black text-slate-900 capitalize">
                                        {showPolicy === 'privacy' && 'Privacy Policy'}
                                        {showPolicy === 'terms' && 'Terms & Conditions'}
                                        {showPolicy === 'refund' && 'Refund & Cancellation'}
                                        {showPolicy === 'shipping' && 'Shipping & Delivery Policy'}
                                        {showPolicy === 'contact' && 'Contact Us'}
                                    </h2>
                                    <button onClick={() => setShowPolicy(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="p-6 overflow-y-auto text-slate-600 space-y-4 text-sm sm:text-base leading-relaxed custom-scrollbar">
                                    {showPolicy === 'privacy' && (
                                        <>
                                            <p>Welcome to <strong>MULTIVITAZ</strong>. We value your privacy and are committed to protecting your personal data.</p>
                                            <h3 className="font-bold text-slate-900 mt-4">1. Information We Collect</h3>
                                            <p>We collect information such as your name, mobile number, email address, and shipping details primarily to process and deliver your orders accurately.</p>
                                            <h3 className="font-bold text-slate-900 mt-4">2. How We Use Data</h3>
                                            <p>Your data is used to process transactions, send order updates via WhatsApp/Email, and improve our services. We do not sell or lease your personal information to third parties.</p>
                                            <h3 className="font-bold text-slate-900 mt-4">3. Security</h3>
                                            <p>We implement a variety of security measures to maintain the safety of your personal information when you place an order.</p>
                                        </>
                                    )}
                                    {showPolicy === 'terms' && (
                                        <>
                                            <p>By accessing this website, you agree to be bound by these Terms and Conditions.</p>
                                            <h3 className="font-bold text-slate-900 mt-4">1. Use of Products</h3>
                                            <p>Our products are intended for personal use. Consult a healthcare professional before starting any supplement if you have pre-existing conditions.</p>
                                            <h3 className="font-bold text-slate-900 mt-4">2. Order Acceptance</h3>
                                            <p>We reserve the right to refuse or cancel any order for reasons including product availability, errors in pricing, or suspected fraud.</p>
                                            <h3 className="font-bold text-slate-900 mt-4">3. Intellectual Property</h3>
                                            <p>All content on this site, including images and text, is the property of {BUSINESS_NAME}.</p>
                                        </>
                                    )}
                                    {showPolicy === 'refund' && (
                                        <>
                                            <p>We want you to be completely satisfied with your purchase from <strong>MULTIVITAZ</strong>.</p>
                                            <h3 className="font-bold text-slate-900 mt-4">1. 7-Day Return Policy</h3>
                                            <p>We offer an easy 7-day return policy for products that are defective, damaged during transit, or if you received the wrong item.</p>
                                            <h3 className="font-bold text-slate-900 mt-4">2. Process</h3>
                                            <p>To initiate a return, contact our support team via WhatsApp or Email within 7 days of receiving the package. The item must be unused and in its original packaging.</p>
                                            <h3 className="font-bold text-slate-900 mt-4">3. Refunds</h3>
                                            <p>Once your return is received and inspected, we will notify you and process the refund to your original payment method within 5-7 business days.</p>
                                        </>
                                    )}
                                    {showPolicy === 'shipping' && (
                                        <>
                                            <p>We strive to provide fast and reliable delivery for every order.</p>
                                            <h3 className="font-bold text-slate-900 mt-4">1. Processing Time</h3>
                                            <p>Orders are typically processed and dispatched within 24-48 hours of placement.</p>
                                            <h3 className="font-bold text-slate-900 mt-4">2. Delivery Estimatess</h3>
                                            <p>Typical delivery timeline is <strong>{DELIVERY_TIMELINE}</strong> across India.</p>
                                            <h3 className="font-bold text-slate-900 mt-4">3. Tracking</h3>
                                            <p>You will receive tracking details via WhatsApp/SMS once your order is dispatched.</p>
                                        </>
                                    )}
                                    {showPolicy === 'contact' && (
                                        <>
                                            <div className="space-y-6">
                                                <div className="flex gap-4 items-start">
                                                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                                                        <MapPin className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-900">Registered Office</h4>
                                                        <p className="text-slate-500 mt-1">{OFFICE_ADDRESS}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-4 items-start">
                                                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                                                        <Phone className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-900">Phone Support</h4>
                                                        <p className="text-slate-500 mt-1">{SUPPORT_PHONE}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-4 items-start">
                                                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                                                        <Mail className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-900">Email Query</h4>
                                                        <p className="text-slate-500 mt-1">{SUPPORT_EMAIL}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                                    <button onClick={() => setShowPolicy(null)} className="px-6 py-2 bg-slate-900 text-white font-bold rounded-xl active:scale-95 transition-transform text-sm sm:text-base">
                                        Close
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* VIDEO MODAL */}
            <AnimatePresence>
                {activeVideo && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4 sm:p-8"
                            onClick={() => setActiveVideo(null)}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="relative w-full max-w-sm aspect-[9/16] bg-black rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <video
                                    src={activeVideo.url}
                                    className="w-full h-full object-cover"
                                    autoPlay
                                    loop
                                    controls
                                    playsInline
                                />
                                <button
                                    onClick={() => setActiveVideo(null)}
                                    className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all z-50"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}