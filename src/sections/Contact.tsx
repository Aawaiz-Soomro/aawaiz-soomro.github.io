import React from "react";
import Section from "@/components/Section";
import Container from "@/components/Container";
import { Mail, Phone, MapPin, Github, Linkedin } from "lucide-react";
import { PROFILE } from "@/data/links";

export default function Contact() {
  return (
    <Section id="contact" className="pb-16 md:pb-28">
      <Container>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Let’s connect
        </h2>
        <p className="mt-2 text-subtext max-w-2xl">
          I’m always open to opportunities in research, internships, or collaboration.
          Feel free to reach out directly:
        </p>

        <div className="mt-8 space-y-4 text-sm text-subtext">
          <a
            href={`mailto:${PROFILE.email}`}
            className="flex items-center gap-3 underline-offset-4 text-accent-cyan hover:text-accent-purple hover:underline transition-colors touch-feedback min-h-[44px]"
          >
            <Mail className="size-5 flex-shrink-0" /> {PROFILE.email}
          </a>
          <a
            href={`mailto:${PROFILE.email2}`}
            className="flex items-center gap-3 underline-offset-4 text-accent-cyan hover:text-accent-purple hover:underline transition-colors touch-feedback min-h-[44px]"
          >
            <Mail className="size-5 flex-shrink-0" /> {PROFILE.email2}
          </a>
          <a
            href={`tel:${PROFILE.phone.replace(/\s/g, '')}`}
            className="flex items-center gap-3 text-accent-cyan hover:text-accent-purple transition-colors touch-feedback min-h-[44px]"
          >
            <Phone className="size-5 flex-shrink-0" /> {PROFILE.phone}
          </a>
          <div className="flex items-center gap-3 min-h-[44px]">
            <MapPin className="size-5 flex-shrink-0" /> {PROFILE.location}
          </div>
        </div>
      </Container>
    </Section>
  );
}