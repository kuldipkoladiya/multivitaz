"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShoppingCart, Star, CheckCircle, ShieldCheck, Leaf, Activity,
    Droplets, Info, Plus, Minus, User, Phone, Mail, MapPin,
    Building, Hash, MessageCircle, X, Sparkles, Play, Pause,
    RefreshCcw, Award, Truck, Banknote, Headset, LifeBuoy, Gift,
    ChevronDown
} from "lucide-react";

export default function Home() {
    const [open, setOpen] = useState(false);
    const [qty, setQty] = useState(1);
    const [payment, setPayment] = useState("upi");
    const [current, setCurrent] = useState(0);
    const [success, setSuccess] = useState(false);

    // ✅ FREE TRIAL CLAIMED TRACKING
    const [trialClaimed, setTrialClaimed] = useState(false);

    // ✅ VARIANT
    const [variant, setVariant] = useState<keyof typeof variants>("trial");

    // ✅ FAKE NOTIFICATION
    const [notification, setNotification] = useState<any>(null);

    // ✅ FAQ STATE
    const [faqForm, setFaqForm] = useState({
        name: "",
        mobile: "",
        question: "",
    });

    // ✅ FAQ ACCORDION STATE
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const [form, setForm] = useState({
        name: "",
        mobile: "",
        email: "",
        address: "",
        city: "",
        pincode: "",
    });

    const WHATSAPP_NUMBER = "919638470305";

    // ✅ VARIANTS DATA
    const variants = {
        "trial": {
            label: "Free Trial – 1 Strip",
            price: 0,
            oldPrice: 299,
            isFree: true,
            images: ["/images/1.jpg", "/images/2.jpg", "/images/3.jpg", "/images/4.jpg", "/images/5.jpg"],
        },
        "30": {
            label: "30 Tablets",
            price: 899,
            oldPrice: 1499,
            isFree: false,
            images: ["/images/1.jpg", "/images/2.jpg", "/images/3.jpg", "/images/4.jpg", "/images/5.jpg"],
        },
        "60": {
            label: "60 Tablets",
            price: 1499,
            oldPrice: 2499,
            isFree: false,
            images: ["/images/6.jpg", "/images/7.jpg", "/images/8.jpg", "/images/9.jpg", "/images/10.jpg"],
        },
    } as const;

    // ✅ MOCK VIDEOS
    const videos = [
        { id: 1, url: "/videos/1.mp4", thumb: "/images/2.jpg", title: "Amazing Growth" },
        { id: 2, url: "/videos/2.mp4", thumb: "/images/3.jpg", title: "2 Weeks Result" },
        { id: 3, url: "/videos/3.mp4", thumb: "/images/4.jpg", title: "Thicker Hair Fast" },
    ];

    const selectedVariant = variants[variant];
    const price = selectedVariant.price;
    const oldPrice = selectedVariant.oldPrice;
    const images = selectedVariant.images;
    const isFreeVariant = selectedVariant.isFree;

    const total = isFreeVariant ? 0 : qty * price;

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
    }, [variant]);

    // 🔥 UPDATED NOTIFICATION LOGIC (WITH LOCATION)
    useEffect(() => {
        const names = ["Rahul", "Priya", "Amit", "Neha", "Karan", "Riya", "Vikas", "Sneha"];
        const cities = ["Surat", "Ahmedabad", "Mumbai", "Delhi", "Pune", "Jaipur", "Rajkot", "Vadodara"];

        const interval = setInterval(() => {
            const randomName = names[Math.floor(Math.random() * names.length)];
            const randomCity = cities[Math.floor(Math.random() * cities.length)];
            const randomQty = Math.floor(Math.random() * 3) + 1;

            setNotification({
                name: randomName,
                city: randomCity,
                qty: randomQty,
                variant: selectedVariant.label,
            });

            setTimeout(() => {
                setNotification(null);
            }, 6000);

        }, Math.floor(Math.random() * 12000) + 12000);

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

    const handleOrder = async () => {
        if (!isFormValid) return;

        const msg = isFreeVariant
            ? `🎁 FREE TRIAL Order\nProduct: MULTIVITAZ Hair Grow+\nVariant: ${selectedVariant.label}\n\n👤 Name: ${form.name}\n📱 Mobile: ${form.mobile}\n📧 Email: ${form.email}\n🏠 Address: ${form.address}\n🏙️ City: ${form.city}\n📍 Pincode: ${form.pincode}\n\n📦 Qty: 1\n💰 Total: FREE (₹0)\n💳 Payment: Not Required`
            : `🛒 Order Details\nProduct: MULTIVITAZ Hair Grow+\nVariant: ${selectedVariant.label}\n\n👤 Name: ${form.name}\n📱 Mobile: ${form.mobile}\n📧 Email: ${form.email}\n🏠 Address: ${form.address}\n🏙️ City: ${form.city}\n📍 Pincode: ${form.pincode}\n\n📦 Qty: ${qty}\n💰 Total: ₹${total}\n💳 Payment: ${payment}`;

        if (isFreeVariant || payment === "cod") {
            // Mark trial as claimed in localStorage
            if (isFreeVariant) {
                localStorage.setItem("multivitaz_trial_claimed", "true");
                setTrialClaimed(true);
                setVariant("30"); // switch away from trial variant immediately
            }
            window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`);
            setOpen(false);
            setSuccess(true);
            return;
        }

        try {
            const res = await fetch("https://multivitaz-be.vercel.app/create-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ amount: total }),
            });

            const order = await res.json();

            const options = {
                key: "YOUR_KEY_ID",
                amount: order.amount,
                currency: "INR",
                order_id: order.id,

                handler: async function (response: any) {
                    await fetch("https://multivitaz-be.vercel.app/verify-payment", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            ...response,
                            formData: form,
                            qty,
                            total,
                            variant: selectedVariant.label,
                        }),
                    });

                    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`);
                    setSuccess(true);
                },

                prefill: {
                    name: form.name,
                    email: form.email,
                    contact: form.mobile,
                },

                theme: {
                    color: "#059669",
                },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();

        } catch (err) {
            console.error(err);
            alert("Payment failed");
        }

        setOpen(false);
    };

    // Component for Individual Video to handle playing state easily
    const VideoCard = ({ vid }: { vid: any }) => {
        const [isPlaying, setIsPlaying] = useState(false);
        const videoRef = useRef<HTMLVideoElement | null>(null);

        const handlePlay = () => {
            if (videoRef.current) {
                if (isPlaying) {
                    if ("pause" in videoRef.current) {
                        videoRef.current.pause();
                    }
                } else {
                    if ("play" in videoRef.current) {
                        videoRef.current.play();
                    }
                }
                setIsPlaying(!isPlaying);
            }
        };

        return (
            <div className="relative shrink-0 snap-center sm:snap-start w-64 sm:w-72 aspect-[9/16] rounded-[2rem] overflow-hidden bg-slate-900 group shadow-lg">
                {!isPlaying && (
                    <img src={vid.thumb} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-300 z-10" alt="Video Thumbnail" />
                )}

                <video
                    ref={videoRef}
                    src={vid.url}
                    className="absolute inset-0 w-full h-full object-cover"
                    loop
                    playsInline
                    onClick={handlePlay}
                />

                {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                        <button className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-emerald-500 group-hover:scale-110 transition-all duration-300">
                            <Play className="w-6 h-6 text-white ml-1 filter drop-shadow-md" />
                        </button>
                    </div>
                )}

                <div className={`absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 to-transparent z-20 pointer-events-none transition-opacity duration-300`}>
                    <p className="font-bold text-sm text-white drop-shadow-md mb-1">{vid.title}</p>
                    <p className="text-xs text-slate-200 line-clamp-2 drop-shadow-md leading-relaxed">See the real transformation.</p>
                </div>

                <button
                    onClick={handlePlay}
                    className="absolute inset-0 w-full h-full z-30 opacity-0 cursor-pointer"
                    aria-label="Toggle Play"
                />
            </div>
        );
    };

    return (
        <div className="bg-[#f8fafc] min-h-screen text-slate-800 font-sans selection:bg-emerald-200 selection:text-emerald-900 overflow-visible relative">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-emerald-100/50 to-transparent pointer-events-none -z-10" />
            <div className="fixed top-[-20%] left-[-10%] w-[80%] md:w-[50%] h-[50%] rounded-full bg-emerald-200/30 blur-[120px] pointer-events-none -z-10" />
            <div className="fixed bottom-[-20%] right-[-10%] w-[80%] md:w-[50%] h-[50%] rounded-full bg-teal-200/30 blur-[120px] pointer-events-none -z-10" />

            {/* NOTIFICATION UI */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95, filter: "blur(4px)" }}
                        transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
                        className="fixed top-4 left-4 right-4 md:left-auto md:translate-x-0 md:right-6 bg-white/90 backdrop-blur-xl border border-emerald-100/50 text-slate-800 px-4 py-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-50 flex items-center gap-4 md:w-auto overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent pointer-events-none" />
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                            <ShoppingCart className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div className="text-sm font-medium leading-snug flex-1">
                            <p>
                                <span className="font-bold text-slate-900">{notification.name}</span> from <span className="text-emerald-700 font-semibold">{notification.city}</span>
                            </p>
                            <p className="text-slate-500 text-xs mt-0.5">
                                Purchased {notification.qty}x {notification.variant}
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
                            className="bg-white rounded-2xl sm:rounded-[2rem] p-3 sm:p-6 shadow-sm border border-slate-100/50 relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={current}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    src={images[current]}
                                    alt="MULTIVITAZ Hair Grow+"
                                    className="w-full h-[220px] sm:h-[350px] md:h-[400px] object-contain relative z-10 drop-shadow-xl"
                                />
                            </AnimatePresence>
                        </motion.div>

                        <div className="flex justify-center sm:justify-start gap-2 sm:gap-4 overflow-x-auto pb-2 sm:pb-4 scrollbar-hide snap-x">
                            {images.map((img, i) => (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    key={i}
                                    onClick={() => setCurrent(i)}
                                    className={`relative w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden shrink-0 snap-start border-2 transition-all duration-300 ${current === i ? "border-emerald-500 shadow-md shadow-emerald-500/20" : "border-slate-200 border-transparent hover:border-emerald-200 bg-white"
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
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-bold tracking-wider uppercase mb-5 sm:mb-6 shadow-sm border border-emerald-200">
                                <Sparkles className="w-3.5 h-3.5" />
                                Premium Formula
                            </div>

                            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                                MULTIVITAZ <br className="hidden sm:block lg:hidden" />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-400 block sm:inline mt-1 sm:mt-0">Hair Grow+</span>
                            </h1>

                            <p className="text-sm sm:text-lg text-slate-600 mt-4 sm:mt-6 leading-relaxed max-w-lg mx-auto lg:mx-0">
                                Advanced clinical-grade hair growth supplement meticulously crafted with Biotin, 18 vital amino acids, vitamins, and minerals for luscious, stronger hair.
                            </p>

                            {/* PRICE */}
                            <div className={`mt-5 sm:mt-8 flex flex-wrap items-baseline justify-center lg:justify-start gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl shadow-sm w-full sm:w-fit ${isFreeVariant ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-300' : 'bg-white border border-slate-100/50'}`}>
                                {isFreeVariant ? (
                                    <>
                                        <span className="text-4xl sm:text-5xl font-black text-emerald-600 tracking-tight">FREE</span>
                                        <span className="text-lg sm:text-xl line-through text-slate-400 font-medium decoration-slate-300">₹{oldPrice}</span>
                                        <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg font-bold text-xs sm:text-sm ml-2 flex items-center gap-1">
                                            <Gift className="w-3.5 h-3.5" /> 100% OFF
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">₹{price}</span>
                                        <span className="text-lg sm:text-xl line-through text-slate-400 font-medium decoration-slate-300">₹{oldPrice}</span>
                                        <div className="bg-rose-100 text-rose-600 px-3 py-1 rounded-lg font-bold text-xs sm:text-sm ml-2">
                                            SAVE {Math.round(((oldPrice - price) / oldPrice) * 100)}%
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

                            {/* VARIANTS */}
                            <div className="mt-6 sm:mt-10">
                                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3 sm:mb-4 hidden sm:block">Choose Package</h3>
                                <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-4">
                                    {(["trial", "30", "60"] as Array<keyof typeof variants>).map((v) => {
                                        const isTrialVariant = v === "trial";
                                        const isSelected = variant === v;
                                        const isTrialDisabled = isTrialVariant && trialClaimed;
                                        return (
                                            <button
                                                key={v}
                                                onClick={() => !isTrialDisabled && setVariant(v)}
                                                disabled={isTrialDisabled}
                                                className={`relative px-4 sm:px-6 py-3 sm:py-4 rounded-2xl font-bold transition-all duration-300 w-full flex-1 flex items-center justify-center gap-2 sm:gap-3 overflow-hidden ${isTrialDisabled
                                                        ? "text-slate-400 bg-slate-100 ring-1 ring-slate-200 cursor-not-allowed opacity-60"
                                                        : isTrialVariant
                                                            ? isSelected
                                                                ? "text-amber-900 ring-2 ring-amber-400 shadow-[0_8px_25px_-4px_rgba(245,158,11,0.4)] bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50"
                                                                : "text-amber-700 bg-gradient-to-br from-amber-50 to-yellow-50 ring-2 ring-amber-300 hover:ring-amber-400 shadow-md hover:shadow-lg animate-pulse"
                                                            : isSelected
                                                                ? "text-emerald-900 ring-2 ring-emerald-500 shadow-[0_8px_20px_-4px_rgba(16,185,129,0.3)] bg-gradient-to-br from-emerald-50 to-emerald-100/50"
                                                                : "text-slate-600 bg-white ring-1 ring-slate-200 hover:ring-emerald-300 hover:bg-slate-50 shadow-sm"
                                                    }`}
                                            >
                                                {isSelected && !isTrialDisabled && (
                                                    <motion.div layoutId="activeVariant" className={`absolute inset-0 w-full ${isTrialVariant ? 'bg-amber-100/30' : 'bg-emerald-100/30'}`} />
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
                                                <span className="relative z-10 text-sm sm:text-lg flex items-center gap-2">
                                                    {isTrialVariant && <Gift className={`w-4 h-4 sm:w-5 sm:h-5 ${trialClaimed ? 'text-slate-400' : 'text-amber-500'}`} />}
                                                    {variants[v].label}
                                                    {isTrialDisabled && <span className="text-[10px] sm:text-xs text-slate-400 font-medium">(Already Used)</span>}
                                                </span>
                                                {isSelected && !isTrialDisabled && <CheckCircle className={`w-5 h-5 relative z-10 shrink-0 ${isTrialVariant ? 'text-amber-600' : 'text-emerald-600'}`} />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <button
                                onClick={() => setOpen(true)}
                                className={`mt-6 sm:mt-10 w-full py-3.5 sm:py-5 rounded-2xl font-bold text-base sm:text-lg shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] transform transition-all active:scale-[0.98] hover:-translate-y-1 flex items-center justify-center gap-3 group relative overflow-hidden ${
                                    isFreeVariant
                                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white'
                                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                                }`}
                            >
                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                                    isFreeVariant
                                        ? 'bg-gradient-to-r from-yellow-400/30 to-amber-400/30'
                                        : 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20'
                                }`} />
                                <span className="relative z-10">{isFreeVariant ? '🎁 Get Free Trial Now' : 'Secure Checkout Now'}</span>
                                {isFreeVariant
                                    ? <Gift className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                                    : <ShoppingCart className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                                }
                            </button>

                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 mt-6 text-sm font-medium text-slate-500">
                                <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Trusted Product</span>
                                <span className="flex items-center gap-1.5"><ShoppingCart className="w-4 h-4 text-emerald-500" /> Fast Delivery</span>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* VIDEOS SECTION */}
                <div className="mt-20 sm:mt-28">
                    <div className="flex items-center gap-3 mb-6 sm:mb-8 justify-center sm:justify-start">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0">
                            <Play className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 ml-1" />
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
                <section className="mt-16 sm:mt-28">
                    <div className="text-center mb-8 sm:mb-12">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 mb-4 shadow-sm border border-emerald-200">
                            <RefreshCcw className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-3 sm:mb-4">
                            Before & After Results
                        </h2>
                        <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
                            Real customers, real transformations. See the incredible difference MULTIVITAZ Hair Grow+ has made.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                        {[
                            { before: "/images/11.jpg", after: "/images/12.jpg", name: "Rahul M.", duration: "8 Weeks", rating: 5 },
                            { before: "/images/13.jpg", after: "/images/15.jpg", name: "Amit K.", duration: "12 Weeks", rating: 5 },
                            { before: "/images/16.jpg", after: "/images/17.jpg", name: "Vikram S.", duration: "6 Weeks", rating: 4 },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="bg-white rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:border-emerald-200 transition-all duration-500 group"
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
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-xl flex items-center justify-center border-2 border-emerald-400">
                                        <RefreshCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
                                    </div>

                                    {/* After */}
                                    <div className="w-1/2 relative overflow-hidden">
                                        <img
                                            src={item.after}
                                            alt={`After - ${item.name}`}
                                            className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                        <span className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-lg">
                                            After
                                        </span>
                                    </div>
                                </div>

                                {/* Card Footer */}
                                <div className="p-4 sm:p-5">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-bold text-slate-900 text-sm sm:text-base">{item.name}</h3>
                                        <span className="bg-emerald-50 text-emerald-700 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
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
                            className="inline-flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-6 py-3 rounded-xl font-bold transition-colors border border-emerald-200 text-sm sm:text-base"
                        >
                            <Sparkles className="w-4 h-4" />
                            Start Your Transformation
                        </button>
                    </div>
                </section>

                {/* CONTENT SECTIONS */}
                <div className="mt-20 sm:mt-28 grid lg:grid-cols-3 gap-8">

                    {/* WHY CHOOSE US */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="bg-white rounded-[2rem] p-6 sm:p-8 md:p-10 shadow-sm border border-slate-100/50">
                            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-6 sm:mb-8 flex items-center gap-3 leading-tight">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0">
                                    <Star className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                                </div>
                                Why Choose MULTIVITAZ?
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-4 text-left">
                                {[
                                    { text: "Biotin Advance Formula", icon: Leaf },
                                    { text: "18 Essential Amino Acids", icon: Activity },
                                    { text: "Rich Vitamins & Minerals", icon: Droplets },
                                    { text: "Clinically Supports Growth", icon: ShieldCheck },
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col sm:flex-row sm:items-center items-start justify-center sm:justify-start p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors group gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                            <item.icon className="w-5 h-5 text-emerald-500" />
                                        </div>
                                        <span className="font-semibold text-slate-800">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="bg-slate-900 text-white rounded-[2rem] p-6 sm:p-8 md:p-10 shadow-xl overflow-hidden relative">
                            <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-emerald-500/20 blur-3xl rounded-full pointer-events-none" />

                            <h2 className="text-2xl md:text-3xl font-extrabold mb-6 sm:mb-8 flex items-center gap-3">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md shrink-0">
                                    <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                                </div>
                                Power-Packed Ingredients
                            </h2>
                            <div className="space-y-6 relative z-10 text-left">
                                {[
                                    { label: "Vitamins", value: "Vitamin C, Niacinamide, Vitamin E, Calcium Pantothenate, Folic Acid, Biotin" },
                                    { label: "Minerals", value: "Calcium, Magnesium, Iron, Zinc, Manganese, Copper, Selenium" },
                                    { label: "Special Blend", value: "18 Essential Amino Acids, Soya Isoflavones, Grape Seed Extract" },
                                ].map((item, i) => (
                                    <div key={i} className="pb-6 border-b border-white/10 last:border-0 last:pb-0">
                                        <h4 className="text-emerald-400 font-bold uppercase tracking-wider text-sm mb-2">{item.label}</h4>
                                        <p className="text-slate-300 leading-relaxed text-sm sm:text-base">{item.value}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* SIDEBAR: HOW TO USE & REVIEWS */}
                    <div className="space-y-8">
                        <section className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-[2rem] p-6 sm:p-8 shadow-sm border border-emerald-100">
                            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <Info className="w-6 h-6 text-emerald-600 shrink-0" />
                                How To Use
                            </h2>
                            <ul className="space-y-4">
                                {[
                                    { icon: Plus, text: "1 tablet daily or as directed by Dietician" },
                                    { icon: Info, text: "Store below 25°C in a dry place" },
                                    { icon: CheckCircle, text: "Pack contains 30 ready-to-use tablets" },
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-4 items-start">
                                        <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 text-emerald-600 border border-emerald-100">
                                            <item.icon className="w-4 h-4" />
                                        </div>
                                        <span className="text-slate-700 font-medium pt-1 leading-tight text-sm sm:text-base">{item.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100/50">
                            <h2 className="text-xl font-bold text-slate-900 mb-6">Real Results</h2>
                            <div className="space-y-4 text-left">
                                {[
                                    { name: "Rahul Sharma", text: "Hair fall reduced in 2 weeks! Very impressive formula.", time: "2 days ago", rating: 5 },
                                    { name: "Priya Patel", text: "Amazing results! Highly recommend to everyone struggling.", time: "5 days ago", rating: 5 },
                                ].map((r, i) => (
                                    <div key={i} className="bg-slate-50 p-4 sm:p-5 rounded-2xl relative">
                                        <div className="flex gap-1 mb-2">
                                            {[...Array(r.rating)].map((_, idx) => <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                                        </div>
                                        <p className="text-slate-700 text-sm italic">"{r.text}"</p>
                                        <p className="text-xs font-bold text-slate-900 mt-3 flex items-center justify-between">
                                            <span>{r.name}</span>
                                            <span className="text-slate-400 font-normal">{r.time}</span>
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                </div>

                {/* HOW TO ORDER SECTION */}
                <section className="mt-16 sm:mt-24">
                    <div className="text-center mb-8 sm:mb-12">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 mb-4 shadow-sm border border-emerald-200">
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
                        <div className="hidden md:block absolute top-[45px] left-[15%] right-[15%] h-0.5 bg-emerald-100 -z-10" />

                        {[
                            { step: 1, title: "Select Package", desc: "Choose between our 30 or 60 tablets package.", icon: CheckCircle },
                            { step: 2, title: "Place Order", desc: "Click on the Secure Checkout or Buy Now button.", icon: ShoppingCart },
                            { step: 3, title: "Fill Details", desc: "Enter delivery details and pick a payment method (UPI / COD).", icon: MapPin },
                            { step: 4, title: "Get Delivery", desc: "Receive your order quickly and start your hair growth journey.", icon: Truck },
                        ].map((item, i) => (
                            <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:border-emerald-200 transition-all flex flex-col items-center text-center group relative mt-6 md:mt-0 hover:-translate-y-1">
                                <div className="absolute -top-6 w-12 h-12 rounded-full bg-emerald-500 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-emerald-500/30 border-4 border-[#f8fafc] group-hover:scale-110 transition-transform">
                                    {item.step}
                                </div>
                                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mt-4 mb-4 group-hover:bg-emerald-100 transition-colors">
                                    <item.icon className="w-7 h-7 text-emerald-600" />
                                </div>
                                <h3 className="font-bold text-slate-900 text-lg mb-2">{item.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* OUR PROMISE SECTION */}
                <section className="mt-16 sm:mt-24">
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
                            <div key={i} className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 hover:border-emerald-200 transition-colors flex flex-col items-center text-center group">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <item.icon className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600" />
                                </div>
                                <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1">{item.title}</h3>
                                <p className="text-xs sm:text-sm text-slate-500">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* NEED HELP SECTION */}
                <section className="mt-16 sm:mt-24">
                    <div className="bg-white rounded-[2rem] p-6 sm:p-8 md:p-10 shadow-sm border border-slate-100/50 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2 flex items-center gap-3">
                                <LifeBuoy className="w-8 h-8 text-emerald-500" />
                                Need Help?
                            </h2>
                            <p className="text-slate-600 text-sm sm:text-base max-w-md">
                                We are here to assist you with your queries. Reach out to us directly for any assistance with your purchase.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-6 py-3 rounded-xl font-bold transition-colors">
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

                {/* FAQ ACCORDION SECTION */}
                <section className="mt-16 sm:mt-24">
                    <div className="text-center mb-8 sm:mb-12">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 mb-4 shadow-sm border border-emerald-200">
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
                            { q: "Is the free trial really free? What's the catch?", a: "Yes, the free trial is absolutely free with ₹0 cost! We offer a 1-strip trial so you can experience the product quality first-hand. There are no hidden charges — it's our way of building trust with our customers. This offer is limited to one per customer." },
                            { q: "What payment methods do you accept?", a: "We accept UPI payments, and also offer Cash on Delivery (COD) for your convenience. For online payments, we use Razorpay's secure payment gateway to ensure your transaction is safe and protected." },
                            { q: "What are the key ingredients?", a: "Our formula includes Biotin, Vitamin C, Vitamin E, Niacinamide, Folic Acid, Calcium Pantothenate, along with essential minerals like Zinc, Iron, Selenium, Calcium, and Magnesium. It also features 18 essential amino acids, Soya Isoflavones, and Grape Seed Extract." },
                            { q: "Is MULTIVITAZ suitable for both men and women?", a: "Yes! MULTIVITAZ Hair Grow+ is specially formulated to work effectively for both men and women experiencing hair thinning, hair fall, or slow hair growth. The nutrients address common deficiencies that affect hair health in all genders." },
                            { q: "How many tablets are in each pack?", a: "We offer two pack sizes — 30 tablets (1-month supply) and 60 tablets (2-month supply). The 60-tablet pack offers better value per tablet. We also offer a free trial of 1 strip so you can try before committing." },
                            { q: "What is your return policy?", a: "We offer a hassle-free 7-day return policy. If you are not satisfied with the product for any reason, you can initiate a return within 7 days of delivery. Simply contact our support team via WhatsApp or email." },
                            { q: "Is MULTIVITAZ GMP and FSSAI certified?", a: "Yes, MULTIVITAZ Hair Grow+ is manufactured in a GMP-certified facility and is FSSAI approved. We adhere to the highest quality standards to ensure every tablet meets strict safety and efficacy requirements." },
                            { q: "How will my order be delivered?", a: "We ship across India via trusted courier partners. Orders are typically dispatched within 24–48 hours and delivered within 5–7 business days depending on your location. You will receive a tracking update once your order is shipped." },
                        ].map((item, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-slate-100 hover:border-emerald-200 transition-all overflow-hidden shadow-sm">
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left group"
                                >
                                    <span className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-emerald-700 transition-colors">{item.q}</span>
                                    <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-emerald-500' : ''}`} />
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
                    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none transform translate-x-1/3 -translate-y-1/3" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none transform -translate-x-1/3 translate-y-1/3" />

                        <div className="text-center mb-8 sm:mb-10 relative z-10">
                            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-500/20 text-emerald-400 mb-5 sm:mb-6 backdrop-blur-sm border border-emerald-500/30">
                                <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8" />
                            </div>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                                Still Have Questions?
                            </h2>
                            <p className="text-emerald-100/70 mt-3 text-base sm:text-lg font-medium max-w-sm mx-auto">
                                Connect with our experts directly on WhatsApp
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 relative z-10 max-w-5xl mx-auto">
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-400 transition-colors" />
                                <input
                                    placeholder="Your Name"
                                    value={faqForm.name}
                                    onChange={(e) => setFaqForm({ ...faqForm, name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 focus:bg-white/10 transition-all rounded-xl sm:rounded-2xl py-3.5 sm:py-4 pl-12 pr-4 backdrop-blur-sm text-sm sm:text-base"
                                />
                            </div>

                            <div className="relative group">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-400 transition-colors" />
                                <input
                                    placeholder="Mobile Number"
                                    value={faqForm.mobile}
                                    onChange={(e) => setFaqForm({ ...faqForm, mobile: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 focus:bg-white/10 transition-all rounded-xl sm:rounded-2xl py-3.5 sm:py-4 pl-12 pr-4 backdrop-blur-sm text-sm sm:text-base"
                                />
                            </div>

                            <div className="relative group">
                                <Info className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-400 transition-colors" />
                                <input
                                    placeholder="What do you want to ask?"
                                    value={faqForm.question}
                                    onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 focus:bg-white/10 transition-all rounded-xl sm:rounded-2xl py-3.5 sm:py-4 pl-12 pr-4 backdrop-blur-sm text-sm sm:text-base"
                                />
                            </div>

                            <button
                                onClick={handleFaqSubmit}
                                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-3.5 sm:py-4 rounded-xl sm:rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 text-sm sm:text-base"
                            >
                                Ask on WhatsApp <MessageCircle className="w-5 h-5 fill-slate-900" />
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            {/* STICKY BOTTOM ACTION */}
            <div className={`fixed bottom-0 left-0 w-full backdrop-blur-xl border-t p-3 sm:p-4 z-40 transform translate-y-0 shadow-[0_-10px_30px_rgb(0,0,0,0.08)] ${isFreeVariant ? 'bg-amber-50/95 border-amber-200/50' : 'bg-white/90 border-slate-200/50'}`}>
                <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 px-1 sm:px-2">
                    <div className="hidden sm:block">
                        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{isFreeVariant ? 'Free Trial' : 'Total Price'}</p>
                        <p className={`font-black text-2xl ${isFreeVariant ? 'text-emerald-600' : 'text-slate-900'}`}>{isFreeVariant ? 'FREE ₹0' : `₹${total}`}</p>
                    </div>
                    <div className="sm:hidden flex flex-col justify-center">
                        <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{isFreeVariant ? 'Free Trial' : 'Total'}</span>
                        <span className={`font-black text-xl leading-none ${isFreeVariant ? 'text-emerald-600' : 'text-slate-900'}`}>{isFreeVariant ? 'FREE' : `₹${total}`}</span>
                    </div>

                    <button
                        onClick={() => setOpen(true)}
                        className={`px-6 sm:px-8 py-3 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg shadow-lg transition-all active:scale-95 flex items-center gap-2 flex-1 sm:flex-none justify-center ${
                            isFreeVariant
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-amber-500/30'
                                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
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
                                        <h3 className="text-lg sm:text-xl font-black text-amber-900">FREE TRIAL OFFER!</h3>
                                        <p className="text-amber-800 text-xs sm:text-sm font-semibold mt-1">Get 1 strip absolutely free — just pay ₹0. No payment required!</p>
                                        <div className="mt-2 inline-flex items-center gap-1.5 bg-white/40 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-amber-900">
                                            <Gift className="w-3.5 h-3.5" /> Limited Time Offer
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-between mb-6 sm:mb-8 pb-4 border-b border-slate-100">
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">{isFreeVariant ? '🎁 Claim Free Trial' : 'Complete Purchase'}</h2>
                                    <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">{isFreeVariant ? 'Fill in delivery details to receive your free strip.' : 'Fill in details for swift delivery.'}</p>
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
                                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 transition-colors group-focus-within:text-emerald-500" />
                                        <input placeholder="Full Name" className="w-full pl-10 sm:pl-11 pr-4 py-3 sm:py-3.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl outline-none transition-all font-medium text-sm sm:text-base" onChange={(e) => setForm({ ...form, name: e.target.value })} />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                        <div className="relative group">
                                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 transition-colors group-focus-within:text-emerald-500" />
                                            <input placeholder="Mobile Number" className="w-full pl-10 sm:pl-11 pr-4 py-3 sm:py-3.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl outline-none transition-all font-medium text-sm sm:text-base" onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
                                        </div>
                                        <div className="relative group">
                                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 transition-colors group-focus-within:text-emerald-500" />
                                            <input placeholder="Email Address" className="w-full pl-10 sm:pl-11 pr-4 py-3 sm:py-3.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl outline-none transition-all font-medium text-sm sm:text-base" onChange={(e) => setForm({ ...form, email: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="relative group">
                                        <MapPin className="absolute left-3.5 top-[14px] sm:top-4 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 transition-colors group-focus-within:text-emerald-500" />
                                        <textarea placeholder="Complete Address" rows={2} className="w-full pl-10 sm:pl-11 pr-4 py-3 sm:py-3.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl outline-none transition-all font-medium resize-none text-sm sm:text-base" onChange={(e) => setForm({ ...form, address: e.target.value })} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                        <div className="relative group">
                                            <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 transition-colors group-focus-within:text-emerald-500" />
                                            <input placeholder="City" className="w-full pl-10 sm:pl-11 pr-3 sm:pr-4 py-3 sm:py-3.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl outline-none transition-all font-medium text-sm sm:text-base" onChange={(e) => setForm({ ...form, city: e.target.value })} />
                                        </div>
                                        <div className="relative group">
                                            <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 transition-colors group-focus-within:text-emerald-500" />
                                            <input placeholder="Pincode" className="w-full pl-10 sm:pl-11 pr-3 sm:pr-4 py-3 sm:py-3.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl outline-none transition-all font-medium text-sm sm:text-base" onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 sm:mt-8 bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-100">
                                {isFreeVariant ? (
                                    /* FREE TRIAL – No quantity or payment needed */
                                    <>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="font-bold text-slate-700 text-sm sm:text-base">Package</span>
                                            <span className="text-sm sm:text-base font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-lg">Free Trial – 1 Strip</span>
                                        </div>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="font-bold text-slate-700 text-sm sm:text-base">Quantity</span>
                                            <span className="text-sm sm:text-base font-black text-slate-900">1</span>
                                        </div>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="font-bold text-slate-700 text-sm sm:text-base">Payment</span>
                                            <span className="text-sm sm:text-base font-bold text-emerald-600 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Not Required</span>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
                                            <p className="text-slate-500 font-semibold text-sm sm:text-base">Total Amount</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-base line-through text-slate-400">₹299</span>
                                                <p className="text-2xl sm:text-3xl font-black text-emerald-600">₹0 FREE</p>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    /* PAID VARIANT – Normal flow */
                                    <>
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="font-bold text-slate-700 text-sm sm:text-base">Quantity</span>
                                            <div className="flex items-center gap-2 sm:gap-3 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                                                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors">
                                                    <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                                                </button>
                                                <span className="w-5 sm:w-6 text-center font-black text-slate-900 text-sm sm:text-base">{qty}</span>
                                                <button onClick={() => setQty(qty + 1)} className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 flex items-center justify-center text-emerald-600 transition-colors">
                                                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <span className="font-bold text-slate-700 block mb-2 text-sm sm:text-base">Payment Method</span>
                                            <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                                <button
                                                    onClick={() => setPayment("upi")}
                                                    className={`p-2 sm:p-3 rounded-xl border-2 font-bold text-xs sm:text-sm transition-all text-center flex flex-col items-center gap-1 sm:gap-2 ${payment === "upi" ? "border-emerald-500 bg-emerald-50/50 text-emerald-700" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"}`}
                                                >
                                                    <Activity className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" />
                                                    UPI / Online
                                                </button>
                                                <button
                                                    onClick={() => setPayment("cod")}
                                                    className={`p-2 sm:p-3 rounded-xl border-2 font-bold text-xs sm:text-sm transition-all text-center flex flex-col items-center gap-1 sm:gap-2 ${payment === "cod" ? "border-emerald-500 bg-emerald-50/50 text-emerald-700" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"}`}
                                                >
                                                    <Building className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" />
                                                    Cash Delivery
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mt-5 sm:mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
                                            <p className="text-slate-500 font-semibold text-sm sm:text-base">Total Amount</p>
                                            <p className="text-2xl sm:text-3xl font-black text-emerald-600">₹{total}</p>
                                        </div>
                                    </>
                                )}
                            </div>

                            <button
                                disabled={!isFormValid}
                                onClick={handleOrder}
                                className={`w-full mt-5 sm:mt-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black text-base sm:text-lg transition-all shadow-[0_10px_20px_-10px_rgba(0,0,0,0.2)] flex items-center justify-center gap-2 ${isFormValid
                                    ? isFreeVariant
                                        ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white hover:-translate-y-1"
                                        : "bg-slate-900 hover:bg-slate-800 text-white hover:-translate-y-1"
                                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                                    }`}
                            >
                                {isFreeVariant ? (
                                    <>
                                        <Gift className={`w-4 h-4 sm:w-5 sm:h-5 ${isFormValid ? "text-white" : ""}`} />
                                        <span>Claim Free Trial</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className={`w-4 h-4 sm:w-5 sm:h-5 ${isFormValid ? "text-emerald-400" : ""}`} />
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
                                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-emerald-100 to-transparent pointer-events-none" />
                                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6 relative z-10">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                    >
                                        <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-600" />
                                    </motion.div>
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 relative z-10">Order Placed!</h2>
                                <p className="text-slate-500 text-sm sm:text-base font-medium leading-relaxed relative z-10">
                                    Thank you for choosing MULTIVITAZ. Your secret to healthier hair is on its way to you!
                                </p>

                                <button
                                    onClick={() => setSuccess(false)}
                                    className="mt-6 sm:mt-8 bg-slate-900 hover:bg-slate-800 text-white font-bold w-full py-3.5 sm:py-4 rounded-xl sm:rounded-2xl transition-all shadow-lg active:scale-95 relative z-10"
                                >
                                    Done
                                </button>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

        </div>
    );
}