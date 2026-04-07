import { useState, useEffect } from "react";
import AuthModal from "./AuthModel";
import {
  Calendar,
  Calendar as Calenders,
  MoveRight,
  Sparkles,
  Users,
  Heart,
  CircleCheckBig,
  //   Facebook,
  //   Twitter,
  //   Instagram,
  //   Linkedin,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import type { CSSProperties } from "react";
import { Button } from "../components/ui/button";
import { MagicCard } from "../components/ui/magic-card";
import DotGrid from "../components/DotGrid";

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signup");
  const [animatedText, setAnimatedText] = useState("Wedding Events");

  useEffect(() => {
    const words = ["Wedding Events", "Birthday Events", "Corporates Events"];
    let timeoutIds: ReturnType<typeof setTimeout>[] = [];

    const textLoad = () => {
      timeoutIds = [
        setTimeout(() => setAnimatedText(words[0]), 0),
        setTimeout(() => setAnimatedText(words[1]), 4000),
        setTimeout(() => setAnimatedText(words[2]), 8000),
      ];
    };

    textLoad();
    const intervalId = setInterval(textLoad, 12000);

    return () => {
      timeoutIds.forEach(clearTimeout);
      clearInterval(intervalId);
    };
  }, []);

  const wordWidths: Record<string, number> = {
    "Wedding Events": 565,
    "Birthday Events": 548,
    "Corporates Events": 648,
  };

  return (
    <>
      <div className="relative h-50 overflow-hidden">
        <div
          className="absolute inset-0 z-0 opacity-60"
        />
        <div className="absolute inset-0 z-10">
          <DotGrid
            dotSize={5}
            gap={15}
            baseColor="#271E37"
            activeColor="#5227FF"
            proximity={120}
            shockRadius={250}
            shockStrength={5}
            resistance={750}
            returnDuration={1.5}
          />
        </div>
        <header className="fixed top-0 z-50 h-20 w-full border-b border-border bg-background/80 py-5 backdrop-blur-md shadow-sm">
          <div className="flex justify-between max-w-6xl mx-auto">
            <h1 className="flex gap-2">
              <Calendar className="mt-1 text-primary" />{" "}
              <span className="text-xl mt-1 font-bold">Eventify</span>
            </h1>
            <div>
              <nav>
                <ul className="flex gap-5">
                  <li>Gallery</li>
                  <li>Feedback</li>
                  <li>FAQ</li>
                </ul>
              </nav>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setOpen(true);
                  setAuthMode("signin");
                }}
                className="flex h-8 gap-1 rounded-md px-2 py-1 text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setOpen(true);
                  setAuthMode("signup");
                }}
                className="flex h-8 gap-1 rounded-md bg-primary px-2 py-1 text-primary-foreground transition-colors hover:bg-primary/90"
              >
                GetStart
              </button>
            </div>
          </div>
        </header>
      </div>
      {open && <AuthModal setOpen={setOpen} defaultMode={authMode} />}
      <main>
        <section className="flex flex-col gap-5 max-h-fit">
          <div className="relative h-100 w-full overflow-hidden rounded-2xl">
            <div className="absolute inset-0">
              <DotGrid
                dotSize={5}
                gap={15}
                baseColor="#271E37"
                activeColor="#5227FF"
                proximity={120}
                shockRadius={250}
                shockStrength={5}
                resistance={750}
                returnDuration={1.5}
              />
            </div>
            <div className="absolute inset-0 z-1 bg-background/45" />

            <div className="relative z-10 flex h-full flex-col items-center justify-center gap-6 px-4 text-center">
              <h2 className="mr-2 flex justify-center text-7xl font-extrabold text-foreground text-nowrap">
                <span className="mt-5 flex flex-col">
                  <span className="h-20">Create Unforgettable</span>
                  <div className="mx-auto inline-block w-2xl rounded-xl border border-border bg-card/80 p-1 shadow-sm backdrop-blur-md">
                    <span
                      key={animatedText}
                      className="typing-mask h-20 bg-linear-to-r/srgb from-primary via-primary/80 to-accent bg-clip-text font-semibold text-transparent"
                      style={
                        {
                          "--word-px": `${wordWidths[animatedText] || 500}px`,
                        } as CSSProperties & { "--word-px": string }
                      }
                    >
                      {animatedText}
                    </span>
                  </div>
                </span>
              </h2>
              <p className="mx-auto max-w-4xl text-center text-lg font-medium text-foreground/90">
                From weddings to corporate events, we bring your vision to life
                with expert planning, seamless execution, and unforgettable
                experiences.
              </p>
              <div className="flex justify-center gap-10">
                <button
                  onClick={() => {
                    setOpen(true);
                    setAuthMode("signup");
                  }}
                  className="flex h-10 gap-1 rounded-md bg-primary p-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Start Planning <MoveRight className="mt-0" />
                </button>
                <button
                  onClick={() => {
                    setOpen(true);
                    setAuthMode("signin");
                  }}
                  className="flex h-10 gap-1 rounded-md border border-border bg-card/95 px-9 py-2 font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </section>
        <section className="my-37 flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <h2 className="flex justify-center text-3xl font-bold">
              Why Choose Eventify?
            </h2>
            <p className="flex justify-center text-base text-muted-foreground">
              Everything you need to plan the perfect event
            </p>
          </div>
          <div className="mx-8 flex gap-5">
            <div className="max-w-md rounded-2xl border border-border bg-card p-2 shadow-sm transition-shadow hover:shadow-lg">
              <Calenders className="mx-auto my-5 h-12 w-12 rounded-full bg-primary/10 p-3 text-primary" />
              <h3 className="text-center my-2 font-semibold text-base">
                Easy Event Booking
              </h3>
              <p className="mx-7 text-center text-sm text-muted-foreground">
                Book your dream event in minutes with our streamlined process
              </p>
            </div>
            <div className="max-w-md rounded-2xl border border-border bg-card p-2 shadow-sm transition-shadow hover:shadow-lg">
              <Sparkles className="mx-auto my-5 h-12 w-12 rounded-full bg-primary/10 p-3 text-primary" />
              <h3 className="text-center my-2 font-semibold">Custom Themes</h3>
              <p className="mx-7 text-center text-sm text-muted-foreground">
                Choose from a variety of beautiful themes tailored to your
                occasion
              </p>
            </div>
            <div className="max-w-md rounded-2xl border border-border bg-card p-2 shadow-sm transition-shadow hover:shadow-lg">
              <Users className="mx-auto my-5 h-12 w-12 rounded-full bg-primary/10 p-3 text-primary" />
              <h3 className="text-center my-2 font-semibold">Expert Team</h3>
              <p className="mx-7 text-center text-sm text-muted-foreground">
                Professional event planners and staff dedicated to your event
              </p>
            </div>
            <div className="max-w-md rounded-2xl border border-border bg-card p-2 shadow-sm transition-shadow hover:shadow-lg">
              <Heart className="mx-auto my-5 h-12 w-12 rounded-full bg-primary/10 p-3 text-primary" />
              <h3 className="text-center my-2 font-semibold">
                Memorable Experiences
              </h3>
              <p className="mx-7 text-center text-sm text-muted-foreground">
                Create unforgettable moments with our comprehensive event
                services
              </p>
            </div>
          </div>
        </section>
        <section className="my-16">
          <h2 className="flex justify-center mb-3 text-3xl font-bold">
            What You Get
          </h2>
          <p className="flex justify-center text-base text-muted-foreground">
            Comprehensive event management at your fingertips
          </p>
          <div className="flex justify-center mt-5 gap-25">
            <div className="flex flex-col gap-4">
              <p className="flex w-95 gap-2 rounded-2xl p-4 transition-colors hover:bg-accent/50">
                <CircleCheckBig className="text-primary" /> Real-time event
                tracking
              </p>
              <p className="flex w-95 gap-2 rounded-2xl p-4 transition-colors hover:bg-accent/50">
                {" "}
                <CircleCheckBig className="text-primary" /> Professional event
                coordination
              </p>
              <p className="flex w-95 gap-2 rounded-2xl p-4 transition-colors hover:bg-accent/50">
                {" "}
                <CircleCheckBig className="text-primary" /> Dedicated customer
                support
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <p className="flex w-95 gap-2 rounded-2xl p-4 transition-colors hover:bg-accent/50">
                <CircleCheckBig className="text-primary" /> Flexible payment
                options
              </p>
              <p className="flex w-95 gap-2 rounded-2xl p-4 transition-colors hover:bg-accent/50">
                <CircleCheckBig className="text-primary" /> Customizable event
                packages
              </p>
              <p className="flex w-95 gap-2 rounded-2xl p-4 transition-colors hover:bg-accent/50">
                <CircleCheckBig className="text-primary" /> 100% satisfaction
                guarantee
              </p>
            </div>
          </div>
        </section>
        <section className="my-16 max-w-6xl mx-auto px-4">
          <div className="flex justify-center">
            <MagicCard
              mode="orb"
              glowFrom="var(--accent)"
              glowTo="var(--primary)"
              className="w-full max-w-sm rounded-2xl"
            >
              <div className="overflow-hidden rounded-2xl border border-border bg-card/90 backdrop-blur-sm">
                <div className="border-b border-border p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://avatars.githubusercontent.com/u/81306489"
                      alt="Yeom JinHo"
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-base">Yeom JinHo</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Frontend Developer
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 p-4">
                  <p className="text-sm font-medium">
                    Frontend Developer focused on Interactive UI &amp;
                    Performance
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    I&apos;m passionate about visual presentation and currently
                    focusing on interactive UI.
                  </p>
                </div>

                <div className="border-t border-border p-4">
                  <Button asChild className="w-full">
                    <a
                      href="https://github.com/Yeom-JinHo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      View on GitHub
                    </a>
                  </Button>
                </div>
              </div>
            </MagicCard>
          </div>
        </section>
        <section className="max-w-6xl mx-auto my-20">
          <div className="rounded-2xl bg-linear-to-r from-primary via-secondary to-accent p-10 text-primary-foreground shadow-lg">
            <h2 className="my-5 text-3xl font-bold flex justify-center">
              Ready to Get Started?
            </h2>
            <p className="flex my-5 justify-center">
              Join thousands of satisfied customers who trust us with their
              special events
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setOpen(true);
                  setAuthMode("signup");
                }}
                className="rounded-md bg-background px-4 py-1 text-[18px] font-bold text-foreground transition-colors hover:bg-background/90"
              >
                Create Account
              </button>
              <button
                onClick={() => {
                  setOpen(true);
                  setAuthMode("signin");
                }}
                className="rounded-md border border-background px-9 py-2 text-background transition-colors hover:bg-background hover:text-foreground"
              >
                Signin
              </button>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full bg-foreground p-10 text-background">
        <div className="flex gap-40">
          <div className="w-70 flex flex-col gap-4">
            <h1 className="flex gap-3 text-xl font-semibold">
              <Calenders className="text-primary" /> Eventify
            </h1>
            <p className="my-2 w-90 text-base text-background/75">
              Creating unforgettable moments through professional event
              management and planning services.
            </p>
            <div className="flex gap-3">
              <div className="h-10 w-10 rounded-full bg-background/10 p-1 transition-colors hover:bg-primary/30 ">
                {/* <Facebook className="h-8 w-8 rounded-full bg-[#1e2939] p-2" /> */}
              </div>
              <div className="h-10 w-10 rounded-full bg-background/10 p-1">
                {/* <Twitter className="h-8 w-8 rounded-full bg-[#1e2939] p-2" /> */}
              </div>
              <div className="h-10 w-10 rounded-full bg-background/10 p-1">
                {/* <Instagram className="h-8 w-8 rounded-full bg-[#1e2939] p-2" /> */}
              </div>
              <div className="h-10 w-10 rounded-full bg-background/10 p-2">
                {/* <Linkedin /> */}
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold whitespace-nowrap">
              Quick Links
            </h3>
            <ul className="my-4 flex flex-col gap-2 text-base text-background/75">
              <li>About us</li>
              <li>Our Services</li>
              <li>Portfolio</li>
              <li>Testimonials</li>
              <li>Blog</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Services</h3>
            <ul className="my-4 flex flex-col gap-2 text-base text-background/75">
              <li className="whitespace-nowrap">Wedding Planning</li>
              <li className="whitespace-nowrap">Corporate Events</li>
              <li className="whitespace-nowrap">Birthday Parties</li>
              <li className="whitespace-nowrap">Social Gatherings</li>
              <li className="whitespace-nowrap">Special Occasions</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">contact us</h3>
            <div className="flex flex-col gap-4 my-5">
              <div className="flex gap-2">
                <MapPin className="text-primary" />
                <span className="mr-10">
                  123 Event Street, New York, NY 10001
                </span>
              </div>
              <div className="flex gap-2">
                <Phone className="text-primary" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex gap-2">
                <Mail className="text-primary" />
                <span>info@eventify.com</span>
              </div>
            </div>
          </div>
        </div>
        <br />
        <hr />
        <div className="flex justify-between">
          <div>
            &copy; <span>2026 Eventify. All rights reserved.</span>
          </div>
          <div>
            <ul className="flex gap-5">
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Terms of Service</a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Dashboard;
