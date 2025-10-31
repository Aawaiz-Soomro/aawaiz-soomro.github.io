export type Project = {
  slug: string;
  title: string;
  blurb: string;
  tags: string[];
  thumb?: string;
  previewVideo?: string;
  mainVideo?: string;
  youtubeVideo?: string;
  previewGif?: string;
  links?: { link?: string; code?: string };
  area?: "Robotics" | "Embedded" | "AI/ML" | "Other";
  status?: 'Active' | 'In Progress' | 'Paused' | 'Archived' | 'Complete';
  active?: boolean;
  body?: string;             // long writeup (supports \n\n)
  gallery?: string[];        // additional images in public/media
};

export const PROJECTS: Project[] = [
  {
    slug: "blip-auv",
    title: "BLIP: Autonomous Underwater Vehicle for Dolphin Research",
    blurb: "AUV robot with real-time whistle/click vocalization classification and closed-loop control.",
    tags: ["Robotics", "C++", "ESP32", "Android", "Controls", "Audio DSP"],
    area: "Robotics",
    status: "Active",
    thumb: "media/blip-auv/blip_thumb.jpg",
    previewVideo: "media/blip-auv/blip_preview.mp4",
    mainVideo: "media/blip-auv/blip_main.mp4",
    links: { link: "https://www.linkedin.com/posts/ojas-mediratta_robotics-embedded-signalprocessing-activity-7358290478351478784-0Afr?utm_source=share&utm_medium=member_desktop&rcm=ACoAADdTxJgB6uIFgkQecw_eTHt3ywpT-XIfTt8" },
    body: `BLIP (Bio-acoustic Learning Interactive Platform) is an autonomous underwater vehicle (AUV) designed for dolphin communication research. Developed in collaboration with the Wild Dolphin Project and Georgia Tech’s Contextual Computing Group, the system combines marine-ready hardware, embedded control systems, and onboard machine learning to enable real-time acoustic interaction with wild dolphins.

      The project has been through more than 15 pool trials and 4 deployments in the Atlantic, evolving into a modular, field-tested platform capable of withstanding harsh marine conditions while running sophisticated signal processing onboard. BLIP represents a unique convergence of robotics, embedded systems, and marine biology, and my contributions have centered on the vehicle’s intelligence and software integration.
      
      To make the system deployable, I built the supporting software ecosystem that researchers used during experiments. This included custom Android dashboards for real-time monitoring, OTA update systems for rapid iteration in the field, and a live web-based telemetry site for tracking robot state and acoustic events during deployments. These tools ensured the platform remained adaptable, testable, and transparent to researchers in both lab and field environments.
      
      On the embedded side, I implemented the control layer linking the ESP32-based thruster board with an onboard Google Pixel 9. The ESP32 handles PID-mixed thruster control for four degrees of freedom (surge, heave, yaw, and pitch), while the Pixel runs the digital signal processing (DSP) pipeline in real time. I engineered that pipeline to handle the dolphin vocalizations, progressing from Goertzel filters and template matching, to FFTs into a CNN-based classification system. Detected whistles are then mapped to interactive behaviors, allowing the robot to respond with context-specific actions in a way that mirrors naturalistic animal communication.

      From a hardware standpoint, the vehicle itself has iterated significantly, incorporating syntactic foam thruster mounts, TPU-based protective skins, and a vacuum-tested pressure vessel for electronics and batteries. While I was not the lead on mechanical design, I was greatly responsible for electronics and hardware integration—developing the sensor stack, power systems, and communication layers to interface reliably within the evolving enclosure.

      BLIP continues to serve as a first-of-its-kind testbed for experimental dolphin communication studies. Ongoing work includes expanding its acoustic vocabulary, improving robustness for long-duration ocean trials, and exploring broader applications in marine human–robot interaction research.`,
    gallery: [
      "media/blip-auv/blip_1.mp4",
      "media/blip-auv/blip_2.jpg",
      "media/blip-auv/blip_3.jpg",
      "media/blip-auv/blip_4.mp4",
      "media/blip-auv/blip_5.jpg",
      "media/blip-auv/blip_6.jpg",
      "media/blip-auv/blip_7.jpg",
      "media/blip-auv/blip_8.jpg",
      "media/blip-auv/blip_9.jpg",
      "media/blip-auv/blip_10.jpg",
      "media/blip-auv/blip_11.jpg",]
  },
  {
    slug: "turtlebot3-ros2",
    title: "ROS2 Perception, Planning, and Control Experiments with TurtleBot3",
    blurb: "Exploring robotics principles in ROS2 using the TurtleBot3 platform, including SLAM, navigation, and computer vision.",
    tags: ["Robotics", "AI/ML", "ROS2", "OpenCV", "Gazebo", "SLAM"],
    area: "Robotics",
    status: "Active",
    thumb: "media/turtlebot3/turtlebot3_thumb.jpg",
    previewVideo: "media/turtlebot3/turtlebot3_preview.mp4",
    mainVideo: "media/turtlebot3/turtlebot3_preview.mp4",
    links: { code: "https://github.com/ojas-mediratta/turtlebot3-ros2" },
    body: `This project is an ongoing exploration of perception, localization, and control using the TurtleBot3 platform under ROS 2 (Humble). It serves as both a deep dive into the fundamentals of the ROS 2 ecosystem and a practical foundation in autonomous mobile robotics.

    I began by developing a perception pipeline that detects and tracks colored objects using OpenCV, integrating ROS 2 publishers and subscribers to broadcast processed image data and target coordinates in real time. This evolved into a cascaded PID control system that fuses camera and LIDAR data, enabling the robot to chase moving targets while maintaining safe distance and angular alignment.

    Building on this, I implemented a Go-to-Goal navigation system that combines odometry and LIDAR sensing for reactive obstacle avoidance. The controller computes velocity commands based on real-time obstacle vectors, allowing the robot to reach arbitrary goal positions while dynamically avoiding collisions. This work provided a foundation in low-level control, sensor fusion, and motion planning.

    Most recently, I extended the system to full-scale mapping, localization, and global navigation using the ROS 2 Nav2 stack. I created occupancy maps of both simulated and real environments using slam_toolbox, configured AMCL (Adaptive Monte Carlo Localization) for robust pose estimation, and tuned costmap and controller parameters to improve stability in narrow corridors. I also developed a ROS 2 node that autonomously publishes sequential waypoints to the /goal_pose topic, allowing the robot to traverse multiple global goals without human input. Testing was conducted in Gazebo’s maze environment and successfully replicated on the physical robot, demonstrating consistent waypoint navigation and environment-aware planning.

    Going forward, I plan to integrate SLAM fusion, semantic mapping, and learning-based control to improve perception-driven decision-making. This project continues to be an evolving testbed for advancing my understanding of ROS 2 architecture, from node-level communication to high-level autonomy`,
    gallery: [
      "media/turtlebot3/turtlebot3_1.mp4",
      "media/turtlebot3/turtlebot3_2.mp4",
      "media/turtlebot3/turtlebot3_3.mp4",
      "media/turtlebot3/turtlebot3_4.mp4",]
  },
  {
    slug: "buzzcaster-guitar",
    title: "BuzzCaster: Gig-Ready, Teensy-Powered Guitar Effects",
    blurb: "Electric guitar with a built-in Teensy 4.1 effects chain, onboard DSP, LCD UI, simple controls, and custom body mods.",
    tags: ["Embedded Systems", "C++", "Teensy 4.1", "Arduino", "Rapid Prototyping", "Audio DSP"],
    area: "Embedded",
    status: "Complete",
    thumb: "media/buzzcaster/buzzcaster_thumb.jpg",
    previewVideo: "media/buzzcaster/buzzcaster_preview.mp4",
    links: { code: "https://github.com/ojas-mediratta/BuzzCaster-Guitar" },
    body: `Guitar has been one of my passions for over a decade. I have spent countless hours playing, tinkering with gear, and chasing tones, always fascinated by how design choices shape the sound and feel of an instrument. When it came time to choose a final project for CS 3651 (Prototyping Intelligent Devices), I saw the chance to bring that passion together with my interest in embedded systems: building a guitar with its own onboard effects.

    The result was BuzzCaster, a custom guitar project that integrates a complete digital signal processing (DSP) chain directly inside the instrument. Instead of relying on external pedals and cables, the guitar itself handles delay, reverb, EQ, and distortion through a Teensy microcontroller running PJRC’s real-time audio framework. The goal was to keep the instrument familiar in form and playability, while giving it the flexibility of a built-in effects unit.

    Making this possible required significant design work. I routed out the guitar body to house the electronics, created a compact LCD and encoder interface for real-time control, and tuned the preamp to preserve the pickups’ natural impedance. Power stability was another challenge, so I designed a dedicated battery housing and safeguards to handle USB quirks and power bank issues.

    The process was iterative, involving circuit prototyping, 3D-printed mounting solutions, firmware development, and repeated testing to refine both tone and ergonomics. By the end, I had not only a fully playable instrument but also a proof of concept in embedded audio design: a guitar that merges traditional playability with integrated digital processing.

    More details, including schematics, firmware, and build notes, are documented in the repo README.`,
    gallery: [
      "media/buzzcaster/buzzcaster_1.jpg",
      "media/buzzcaster/buzzcaster_2.jpg",
      "media/buzzcaster/buzzcaster_3.jpg",
      "media/buzzcaster/buzzcaster_4.mp4",
      "media/buzzcaster/buzzcaster_5.jpg",
      "media/buzzcaster/buzzcaster_6.jpg",
      "media/buzzcaster/buzzcaster_7.jpg",
      "media/buzzcaster/buzzcaster_8.jpg",
      "media/buzzcaster/buzzcaster_9.jpg",
      "media/buzzcaster/buzzcaster_10.jpg",
      "media/buzzcaster/buzzcaster_11.jpg",]
  },
  {
    slug: "hackGT12",
    title: "Dose: Modern care in a bottle [HackGT 12 Best Overall Winner]",
    blurb: "A smart medicine bottle that uses embedded sensing and rich dashboards to ensure safe, consistent medication adherence.",
    tags: ["Embedded Systems", "C++", "ESP32", "Rapid Prototyping", "MedTech"],
    area: "Embedded",
    status: "Complete",
    thumb: "media/hackGT12/dose_thumb3.jpeg",
    previewVideo: "media/hackGT12/dose_preview.mp4",
    youtubeVideo: "8https://youtu.be/j7cSnyq9Vn8?si=D-a5kVKJLNQyEynK",
    links: { code: "https://github.com/dawsonp2003/HackGT12-Dose", link: "https://devpost.com/software/dose-ebmo9z" },
    body: `Dose was my HackGT12 Hackathon project. This was my first ever hackathon, and I loved it. Over the course of 36 intense hours, my team and I brainstormed, built, and debugged our way through sleepless nights, sticky notes, and too many energy drinks to count. HackGT12 brought together 900+ participants, and being part of that energy—watching the room buzz with ideas while racing the clock to bring ours to life—was unforgettable.  

  We set out to tackle a problem that’s huge but often invisible: medication non-adherence.  

  Medication non-adherence happens when patients don’t take their medication at the prescribed time or in the prescribed way. It might sound simple, but the impact is massive—studies estimate it costs the U.S. healthcare system $100–300 billion every year in avoidable direct costs. Missed doses, overdoses, and inconsistent adherence don’t just create complications for patients, but also ripple outward into failed treatments, unnecessary hospitalizations, and unreliable results in drug trial research.  

  That’s where Dose comes in. We designed it as a smart pill bottle that combines embedded sensing with rich data delivery. For patients, it makes adherence straightforward. For researchers and clinicians, it provides the high-quality data needed to truly understand whether treatments are working as intended. Building the hardware, software, and dashboard in such a short time was equal parts challenging and exhilarating—but seeing our prototype come together at the expo made every late-night bug fix worth it.`,
    gallery: [
      "media/hackGT12/dose_1.jpeg",
      "media/hackGT12/dose_2.jpeg",
      "media/hackGT12/dose_3.jpeg", 
      "media/hackGT12/dose_4.jpeg",
      "media/hackGT12/dose_5.jpeg",
      "media/hackGT12/dose_6.jpeg",
      "media/hackGT12/dose_7.jpeg",
      "media/hackGT12/dose_8.jpeg",
      "media/hackGT12/dose_9.jpeg",
      "media/hackGT12/dose_10.jpeg",
      "media/hackGT12/dose_11.jpeg",
      "media/hackGT12/dose_12.jpeg",
      "media/hackGT12/dose_13.jpeg",
      "media/hackGT12/dose_14.jpeg",
    ]
  },
  {
    slug: "et55-keyboard",
    title: "ET55: A Custom 55‑key, Hand‑Wired Mechanical Keyboard.",
    blurb: "An ultra-compact board blending the vintage feel of IBM Model F layouts with modern touches—QMK firmware, USB-C, an OLED status screen, and a rotary-encoder volume knob.",
    tags: ["Embedded Systems", "C++", "ATMega34U4", "Fusion360", "Rapid Prototyping"],
    area: "Embedded",
    status: "Complete",
    thumb: "media/et55/et55_thumb.jpg",
    previewVideo: "media/et55/et55_preview.mp4",
    mainVideo: "media/et55/et55_main.mp4",
    links: { code: "https://github.com/ojas-mediratta/ET55-Keyboard" },
    body: `Mechanical keyboards have always fascinated me, not just for the way they feel but also for the creativity in the enthusiast scene. By the time I took ECE 4180 (Embedded Systems Design), I had already built and commissioned several boards, but I wanted to take things further and design one that was truly my own. That idea became ET55: a 55-key, hand-wired keyboard inspired by vintage IBM layouts but built with modern embedded features.

    I wired every switch by hand, adding diodes for full NKRO support and heat-shrinking each joint to keep the matrix clean. For control, I used a Pro Micro (ATmega32U4) running QMK, which let me configure a flexible four-layer layout. I mounted the microcontroller externally on pin headers so it could be swapped out easily - important since I needed to return the board at the end of the course and wanted it to be literally plug-and-play. Debugging the matrix took time; one miswired column had me chasing phantom keypresses with a multimeter before everything lined up.

    I also built in some modern conveniences: a USB-C port for reliability, a rotary encoder that doubled as both a volume knob and layer switch, and a small OLED display for system status or animations. To house everything, I modeled and 3D-printed a custom case and plate, iterating on tolerances until the fit felt polished and solid despite the hand-wired internals.

    The result wasn’t just a usable keyboard but a complete end-to-end embedded project, combining hardware wiring, firmware development, debugging, and enclosure design. ET55 blends the nostalgia of classic layouts with the flexibility of modern microcontrollers, and it remains one of my most personal builds.

    [See the repo README for full build notes.]`,
    gallery: [
      "media/et55/et55_1.jpg",
      "media/et55/et55_2.jpg",
      "media/et55/et55_3.jpg",
      "media/et55/et55_4.mp4",
    ]
  },
  {
    slug: "keyboard-design",
    title: "Freelance Custom Mechanical Keyboard Design and Manufacturing",
    blurb: "Completely bespoke mechanical keyboards, tailored to client specifications and preferences, and machined out of premium materials.",
    tags: ["Design and Manufacturing", "Fusion360", "Blender", "DFM"],
    area: "Other",
    status: "Complete",
    thumb: "media/keyboard-design/keyboard-design_thumb.jpg",
    previewVideo: "media/keyboard-design/keyboard-design_preview.mp4",
    mainVideo: "media/keyboard-design/keyboard-design_preview.mp4",
    body: `Like many in the enthusiast mechanical keyboard community, I started out fascinated by the artistry and engineering that go into custom boards. The scene thrives on experimentation, people debating mounting styles, chasing the perfect sound profile, and pushing the limits of what a typing tool can be. I wanted more than just to buy into that culture; I wanted to create something of my own.

      With no prior experience in CAD, I dove into Fusion 360. At first, I barely knew how to sketch a rectangle, but I pushed through tutorials, forums, and trial-and-error late nights until I could translate ideas into working 3D models. My first goal was simple: design a board that felt truly bespoke, tailored to my hands, my workflow, and my taste.

      From there, freelance commissions grew organically. Clients would come with a concept, sometimes just a layout or an aesthetic inspiration, and I’d take on the challenge of turning it into a manufacturable design. That meant iterating on case geometry, experimenting with plate materials, and ensuring PCB compatibility, all while keeping ergonomics and acoustics in mind.

      Over time, I honed a process that combined community-driven design values with engineering rigor: CAD modeling in Fusion 360, prototyping through 3D prints or CNC samples, and firmware integration via QMK or VIA. Each project became an exploration of form and function, not just making a keyboard that works, but one that feels alive, with its own personality and presence on a desk.

      This journey has been as much about problem-solving as it has been about craft. What began as a personal desire for a one-off board turned into a series of freelance collaborations where I could merge technical design with the culture of enthusiast keyboards, producing pieces that are at once tools and expressions of identity.`,
    gallery: [
      "media/keyboard-design/keyboard-design_2.mp4",
      "media/keyboard-design/keyboard-design_3.mp4",
      "media/keyboard-design/keyboard-design_5.jpg",
      "media/keyboard-design/keyboard-design_6.mp4",
      "media/keyboard-design/keyboard-design_7.jpg",
      "media/keyboard-design/keyboard-design_8.jpg",
      "media/keyboard-design/keyboard-design_9.mp4",
      "media/keyboard-design/keyboard-design_10.jpg",
      "media/keyboard-design/keyboard-design_11.jpg",
      "media/keyboard-design/keyboard-design_12.jpg",
      "media/keyboard-design/keyboard-design_13.jpg",
      "media/keyboard-design/keyboard-design_14.jpg",
      "media/keyboard-design/keyboard-design_15.mp4",
      "media/keyboard-design/keyboard-design_16.mp4",
      "media/keyboard-design/keyboard-design_17.jpg",
      "media/keyboard-design/keyboard-design_18.jpg",
      "media/keyboard-design/keyboard-design_19.jpg",
      "media/keyboard-design/keyboard-design_20.jpg",
      "media/keyboard-design/keyboard-design_21.jpg",
      "media/keyboard-design/keyboard-design_22.jpg",
      "media/keyboard-design/keyboard-design_23.jpg",
      "media/keyboard-design/keyboard-design_24.jpg",
    ]
  },
];