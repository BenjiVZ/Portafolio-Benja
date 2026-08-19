<template>
  <div class="portfolio">
    <ScrollProgress />
    <Navbar />
    <main>
      <HeroSection />
      <!-- <LaptopScroll /> -->
      <AboutSection />
      <ExperienceSection />
      <ServicesSection />
      <CtaBand />
      <ProjectsSection />
      <FlyersSection />
      <ContactSection />
    </main>
    <FooterSection />
    <BackToTop />
    <WhatsAppFloat />
    <OrigenDatos />
  </div>
</template>

<script setup>
import ScrollProgress from '../components/ScrollProgress.vue'
import BackToTop from '../components/BackToTop.vue'
import WhatsAppFloat from '../components/WhatsAppFloat.vue'
import OrigenDatos from '../components/OrigenDatos.vue'
import CtaBand from '../components/CtaBand.vue'
import Navbar from '../components/Navbar.vue'
import HeroSection from '../components/HeroSection.vue'
// import LaptopScroll from '../components/LaptopScroll.vue'
import AboutSection from '../components/AboutSection.vue'
import ExperienceSection from '../components/ExperienceSection.vue'
import ServicesSection from '../components/ServicesSection.vue'
import ProjectsSection from '../components/ProjectsSection.vue'
import FlyersSection from '../components/FlyersSection.vue'
import ContactSection from '../components/ContactSection.vue'
import FooterSection from '../components/FooterSection.vue'
</script>
