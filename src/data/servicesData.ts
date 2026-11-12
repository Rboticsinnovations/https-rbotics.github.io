/**
 * Services offered by RBOTICS — used for the home page service cards and the SEO
 * files generated at build time (vite.config.ts). All services are presented on the
 * home page (https://www.rbotics.in), not on separate URLs.
 * Keep this file free of React imports: vite.config.ts imports it.
 */
export interface ServiceInfo {
    id: string; // in-page anchor, e.g. https://www.rbotics.in/#3d-printing
    name: string;
    icon: string; // Font Awesome class
    summary: string;
}

export const SITE_URL = 'https://www.rbotics.in';
export const SITE_NAME = 'RBOTICS Innovations';

export const SERVICES: ServiceInfo[] = [
    {
        id: 'fabrication',
        name: 'Machining & Custom Fabrication',
        icon: 'fa-cogs',
        summary: 'Precision CNC machining and custom fabrication solutions tailored to your specific requirements. We turn your designs into robust reality.',
    },
    {
        id: '3d-printing',
        name: '3D Printing Services',
        icon: 'fa-cube',
        summary: 'High-quality rapid prototyping and additive manufacturing. From concept models to functional end-use parts.',
    },
    {
        id: 'carbon-fiber',
        name: 'Custom Carbon Fiber Products',
        icon: 'fa-feather-alt',
        summary: 'Lightweight and durable carbon fiber manufacturing services for high-performance applications.',
    },
    {
        id: 'design-assistance',
        name: 'Design Assistance',
        icon: 'fa-pencil-ruler',
        summary: 'Expert guidance in mechanical and electronic design to optimize your product for manufacturing and performance.',
    },
    {
        id: 'pcb-design',
        name: 'PCB Designing',
        icon: 'fa-microchip',
        summary: 'Professional PCB layout and design services, ensuring reliability and signal integrity for your electronics.',
    },
    {
        id: 'li-ion-battery-packs',
        name: 'Li-ion Battery Packs',
        icon: 'fa-battery-full',
        summary: 'Custom Lithium-ion battery pack assembly for various applications, prioritizing safety and efficiency.',
    },
];

/** Every public URL, with its SEO title/description. Used for the sitemap and per-page HTML. */
export const PUBLIC_PAGES: { path: string; title: string; description: string }[] = [
    {
        path: '/',
        // Title: the strongest signal for which searches the home page should appear in
        title: 'RBOTICS | 3D Printing, Carbon Fiber, PCB Design & Li-ion Battery Packs',
        description: 'RBOTICS Innovations, Vizianagaram, Andhra Pradesh: 3D printing services, CNC machining & fabrication, custom carbon fiber products, PCB designing, design assistance and Li-ion battery packs.',
    },
    {
        path: '/products',
        title: 'Robotics Components, Li-ion Batteries & Drone Parts | RBOTICS',
        description: 'Shop robotics components from RBOTICS: Li-ion battery packs, drone parts, sensors, development boards, motors, drivers and IoT modules.',
    },
];
