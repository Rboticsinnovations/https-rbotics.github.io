export interface ProductItem {
    id: string;
    sku: string;
    name: string;
    category: string;
    subSubCategory: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviewsCount: number;
    initialStock: number;
    voltage?: string;
    capacity?: string;
    dischargeRate?: string;
    connector?: string;
    brand: string;
    hasBms?: boolean;
    weight?: string;
    description: string;
    features: string[];
    packageIncludes: string[];
    warranty?: string;
    datasheetUrl?: string;
    imageUrl?: string;
    images?: string[];
}

export const ALLOWED_CATEGORIES = [
    'Electronic Components',
    '3D Printers and Parts',
    'Drone Parts',
    'Development Boards',
    'Batteries, Power Supply and Accessories',
    'Sensors',
    'Motors | Drivers | Pumps | Actuators',
    'IoT and Wireless Modules',
    'Prototyping Services'
] as const;

export type AllowedCategory = typeof ALLOWED_CATEGORIES[number];

export const INITIAL_PRODUCTS: ProductItem[] = [
    // ----------------------------------------------------
    // Batteries, Power Supply and Accessories
    // ----------------------------------------------------
    {
        id: '1cell-2000mah',
        sku: '1553350',
        name: 'Pro-Range A Grade NMC N18650CH 3.7V 2000mAh 3C 1S1P Li-Ion Battery Pack',
        category: 'Batteries, Power Supply and Accessories',
        subSubCategory: '1 Cell Li-Ion Battery Pack (3.6V~4.2V)',
        price: 259,
        originalPrice: 320,
        rating: 5.0,
        reviewsCount: 4,
        initialStock: 18,
        voltage: '3.7V',
        capacity: '2000 mAh',
        dischargeRate: '3C',
        connector: '2 Pin JST-XH',
        brand: 'Pro-Range',
        hasBms: false,
        weight: '48g',
        warranty: '15 Days Replacement Warranty against manufacturing defects and cell imbalance.',
        datasheetUrl: 'https://rbotics.in/datasheets/N18650CH-2000mAh-Specification.pdf',
        description: 'Pro-Range batteries are known for performance, reliability, and price. Pro-Range A Grade NMC N18650CH 3.7V 2000mAh 3C 1S1P Li-Ion Battery Pack is designed for robotics, microcontrollers, and portable DIY electronics.',
        features: [
            '2 Pin JST-XH Balance Connector',
            'Discharge Port: Open Wire / JST',
            'Easy to use with robotics and DIY kits',
            'High quality Grade A NMC cylindrical cells'
        ],
        packageIncludes: [
            '1 x Pro-Range A Grade NMC N18650CH 3.7V 2000mAh 3C 1S1P Li-Ion Battery Pack'
        ]
    },
    {
        id: '1cell-2200mah-oos',
        sku: '1553351',
        name: 'Pro-Range A Grade NMC N18650CH 3.7V 2200mAh 3C 1S1P Li-Ion Battery Pack',
        category: 'Batteries, Power Supply and Accessories',
        subSubCategory: '1 Cell Li-Ion Battery Pack (3.6V~4.2V)',
        price: 259,
        originalPrice: 310,
        rating: 4.8,
        reviewsCount: 3,
        initialStock: 0, // Out of Stock example
        voltage: '3.7V',
        capacity: '2200 mAh',
        dischargeRate: '3C',
        connector: '2 Pin JST-XH',
        brand: 'Pro-Range',
        hasBms: false,
        weight: '50g',
        warranty: '15 Days Replacement Warranty',
        datasheetUrl: 'https://rbotics.in/datasheets/N18650CH-2200mAh-Datasheet.pdf',
        description: 'Pro-Range A Grade NMC N18650CH 3.7V 2200mAh 3C 1S1P battery pack provides reliable single-cell energy with excellent thermal stability.',
        features: [
            'Grade A 2200mAh 18650 cell',
            'Standard JST-XH output',
            'Lightweight shrink-wrapped packaging'
        ],
        packageIncludes: [
            '1 x Pro-Range 3.7V 2200mAh 1S1P Battery Pack'
        ]
    },
    {
        id: '1cell-2600mah',
        sku: '1553352',
        name: 'Pro-Range A Grade NMC N18650CH 3.7V 2600mAh 3C 1S1P Li-Ion Battery Pack',
        category: 'Batteries, Power Supply and Accessories',
        subSubCategory: '1 Cell Li-Ion Battery Pack (3.6V~4.2V)',
        price: 259,
        originalPrice: 349,
        rating: 5.0,
        reviewsCount: 1,
        initialStock: 25,
        voltage: '3.7V',
        capacity: '2600 mAh',
        dischargeRate: '3C',
        connector: '2 Pin JST-XH',
        brand: 'Pro-Range',
        hasBms: false,
        weight: '52g',
        warranty: '15 Days Replacement Warranty',
        datasheetUrl: 'https://rbotics.in/datasheets/N18650CH-2600mAh-Spec.pdf',
        description: 'High capacity 2600mAh 1S1P Li-Ion pack providing extended runtimes for IoT modules, handheld instruments, and small robotic platforms.',
        features: [
            '2600mAh high energy capacity',
            'Consistent discharge curve',
            'Factory tested internal resistance'
        ],
        packageIncludes: [
            '1 x Pro-Range 3.7V 2600mAh 1S1P Battery Pack'
        ]
    },
    {
        id: '1cell-2500mah-cop',
        sku: '1553353',
        name: 'Pro-Range A Grade NMC N18650COP 3.7V 2500mAh 5C 1S1P Li-Ion Battery Pack',
        category: 'Batteries, Power Supply and Accessories',
        subSubCategory: '1 Cell Li-Ion Battery Pack (3.6V~4.2V)',
        price: 519,
        originalPrice: 650,
        rating: 4.9,
        reviewsCount: 5,
        initialStock: 12,
        voltage: '3.7V',
        capacity: '2500 mAh',
        dischargeRate: '5C',
        connector: '2-Pin JST RCY BEC Female',
        brand: 'Pro-Range',
        hasBms: true,
        weight: '55g',
        warranty: '15 Days Replacement Warranty with integrated BMS coverage.',
        datasheetUrl: 'https://rbotics.in/datasheets/N18650COP-5C-Datasheet.pdf',
        description: 'High discharge rate (5C continuous) 2500mAh battery pack with integrated protection circuit module and heavy gauge copper leads.',
        features: [
            '5C high drain discharge capability',
            'Built-in BMS for overcharge and short-circuit cutoff',
            'Gold-plated 2-Pin JST RCY BEC connector'
        ],
        packageIncludes: [
            '1 x Pro-Range NMC N18650COP 3.7V 2500mAh 5C Battery Pack'
        ]
    },
    {
        id: '2cell-2200mah-74v',
        sku: '1553360',
        name: 'Orange 7.4V 2200mAh 2S 20C Li-Ion Battery Pack with XT60',
        category: 'Batteries, Power Supply and Accessories',
        subSubCategory: '2 Cell Li-Ion Battery Pack (7.4V~8.4V)',
        price: 749,
        originalPrice: 950,
        rating: 4.8,
        reviewsCount: 14,
        initialStock: 16,
        voltage: '7.4V',
        capacity: '2200 mAh',
        dischargeRate: '20C',
        connector: 'XT60 + JST-XH',
        brand: 'Orange',
        hasBms: true,
        weight: '110g',
        warranty: '15 Days Replacement Warranty',
        datasheetUrl: 'https://rbotics.in/datasheets/Orange-7.4V-2200mAh-Datasheet.pdf',
        description: '7.4V 2S battery pack designed for RC robots, transmitter remotes, and embedded micro-controllers needing dual-cell voltage.',
        features: ['XT60 discharge plug', 'JST-XH balance plug', 'High discharge output'],
        packageIncludes: ['1 x 7.4V 2200mAh 2S Li-Ion Pack']
    },
    {
        id: '3cell-11v-5000mah',
        sku: '1553370',
        name: 'Orange 11.1V 12V 5000mAh 3S Li-Ion Pack with DC Jack & XT60',
        category: 'Batteries, Power Supply and Accessories',
        subSubCategory: '3 Cell 12V Li-Ion Battery Pack (11.1V~12.6V)',
        price: 1850,
        originalPrice: 2200,
        rating: 5.0,
        reviewsCount: 22,
        initialStock: 14,
        voltage: '11.1V',
        capacity: '5000 mAh',
        dischargeRate: '25C',
        connector: 'XT60 + DC 5.5mm',
        brand: 'Orange',
        hasBms: true,
        weight: '320g',
        warranty: '30 Days Replacement Warranty against cell divergence.',
        datasheetUrl: 'https://rbotics.in/datasheets/Orange-11.1V-5000mAh-Datasheet.pdf',
        description: 'Direct 12V replacement Lithium-ion pack for CCTV, routers, ROV electronics, and Arduino/Raspberry Pi robotics.',
        features: ['12V nominal output', 'Dual output plugs (XT60 + DC 5.5mm)', 'Overcharge & Overdischarge cutoff'],
        packageIncludes: ['1 x Orange 11.1V 5000mAh 3S Battery Pack']
    },
    {
        id: '4cell-14v-5000mah',
        sku: '1553380',
        name: 'Pro-Range 14.8V 5000mAh 4S Li-Ion High Discharge Pack',
        category: 'Batteries, Power Supply and Accessories',
        subSubCategory: '4 Cell 15V Li-Ion Battery Pack (14.8V~16.8V)',
        price: 2450,
        originalPrice: 2900,
        rating: 4.8,
        reviewsCount: 11,
        initialStock: 9,
        voltage: '14.8V',
        capacity: '5000 mAh',
        dischargeRate: '30C',
        connector: 'XT90',
        brand: 'Pro-Range',
        hasBms: true,
        weight: '430g',
        warranty: '15 Days Replacement Warranty',
        datasheetUrl: 'https://rbotics.in/datasheets/ProRange-4S-5000mAh-Datasheet.pdf',
        description: 'Standard 4S pack providing powerful energy delivery for quadcopters, drone motors, and high-thrust brushless underwater thrusters.',
        features: ['14.8V nominal voltage', 'XT90 anti-spark connection', 'Low internal resistance'],
        packageIncludes: ['1 x Pro-Range 14.8V 5000mAh 4S Pack']
    },
    {
        id: 'custom-batt-pack',
        sku: '1553390',
        name: 'Rbotics Custom Engineered Industrial Battery Pack (12V-72V)',
        category: 'Batteries, Power Supply and Accessories',
        subSubCategory: 'Custom Battery Pack',
        price: 9999,
        originalPrice: 12500,
        rating: 5.0,
        reviewsCount: 19,
        initialStock: 5,
        voltage: 'Custom',
        capacity: 'Custom (10Ah - 100Ah)',
        dischargeRate: 'Configurable',
        connector: 'Custom Specification',
        brand: 'Rbotics Innovations',
        hasBms: true,
        weight: 'Tailored',
        warranty: '6 Months Manufacturer Industrial Warranty with factory QA certificate.',
        datasheetUrl: 'https://rbotics.in/datasheets/Rbotics-Custom-Pack-Specification.pdf',
        description: 'Precision engineered custom battery packs assembled with spot-welded pure nickel strips, active smart BMS, waterproof cases, and custom telemetry output.',
        features: ['Custom dimensions & voltage', 'CAN-Bus / Bluetooth telemetry options', 'Grade A cell matching'],
        packageIncludes: ['1 x Custom Engineered Battery Pack with Test Certification']
    },
    {
        id: '6cell-22v-15000mah',
        sku: '1553395',
        name: 'Orange 22.2V 15000mAh 6S Li-Ion Drone Heavy Lifter Pack',
        category: 'Batteries, Power Supply and Accessories',
        subSubCategory: '5 ~ 7 Cell Li-Ion Battery Pack',
        price: 13500,
        originalPrice: 15999,
        rating: 4.9,
        reviewsCount: 16,
        initialStock: 7,
        voltage: '22.2V',
        capacity: '15000 mAh',
        dischargeRate: '35C',
        connector: 'AS150 / XT90',
        brand: 'Orange',
        hasBms: true,
        weight: '1650g',
        warranty: '30 Days Replacement Warranty',
        datasheetUrl: 'https://rbotics.in/datasheets/Orange-6S-15000mAh-Datasheet.pdf',
        description: 'Ultra high density 6S battery system engineered for agriculture spraying drones and commercial inspection aircraft.',
        features: ['22.2V high voltage system', '15000mAh extreme flight time', 'Flame-retardant outer wrap'],
        packageIncludes: ['1 x Orange 22.2V 15000mAh 6S Battery Pack']
    },

    // ----------------------------------------------------
    // Drone Parts
    // ----------------------------------------------------
    {
        id: 'drone-frame-carbon-450',
        sku: '2100450',
        name: 'Rbotics Apex 450 Carbon Fiber Quadcopter Frame Kit',
        category: 'Drone Parts',
        subSubCategory: 'Quadcopter Frames',
        price: 3499,
        originalPrice: 4200,
        rating: 4.9,
        reviewsCount: 12,
        initialStock: 15,
        brand: 'Rbotics Innovations',
        weight: '280g',
        warranty: '30 Days Replacement Warranty against material defects.',
        datasheetUrl: 'https://rbotics.in/datasheets/Apex450-Carbon-Frame-CAD-Spec.pdf',
        description: 'Aerospace-grade 3K matte weave carbon fiber frame with CNC chamfered edges, integrated PDB vibration damping mountings, and high strength aluminum standoffs.',
        features: ['3K Full Carbon Fiber Construction', 'Reinforced 4mm arm thickness', 'Dual battery strap mounting bays'],
        packageIncludes: ['1 x Carbon Fiber Main Plate Set', '4 x Arms', '1 x Hardware Fastener Kit']
    },
    {
        id: 'drone-esc-4in1-45a',
        sku: '2100451',
        name: 'SkyHawk 45A BLHeli_32 4-in-1 Brushless ESC (3S-6S)',
        category: 'Drone Parts',
        subSubCategory: 'Electronic Speed Controllers',
        price: 3899,
        originalPrice: 4500,
        rating: 4.8,
        reviewsCount: 8,
        initialStock: 10,
        brand: 'SkyHawk',
        weight: '14g',
        warranty: '15 Days Replacement Warranty.',
        datasheetUrl: 'https://rbotics.in/datasheets/SkyHawk-45A-BLHeli32-Datasheet.pdf',
        description: 'High performance BLHeli_32 4-in-1 speed controller supporting DShot1200, real-time current telemetry sensor, and onboard large filtering capacitors.',
        features: ['Continuous Current: 45A x 4', 'Burst: 55A (10s)', 'Supports DShot300/600/1200'],
        packageIncludes: ['1 x 4-in-1 ESC', '1 x 8-pin harness', '1 x Low-ESR Capacitor']
    },

    // ----------------------------------------------------
    // Development Boards
    // ----------------------------------------------------
    {
        id: 'dev-esp32-s3-cam',
        sku: '3100101',
        name: 'ESP32-S3 Dual-Core AI Vision & Wireless IoT Board with OV2640',
        category: 'Development Boards',
        subSubCategory: 'ESP32 Modules',
        price: 1199,
        originalPrice: 1499,
        rating: 5.0,
        reviewsCount: 29,
        initialStock: 35,
        brand: 'Espressif Systems',
        weight: '18g',
        warranty: '15 Days Replacement Warranty against DOA.',
        datasheetUrl: 'https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf',
        description: 'Xtensa 32-bit LX7 dual-core microprocessor running up to 240MHz with 2.4GHz Wi-Fi, Bluetooth 5 (LE), 8MB PSRAM, and high performance 2MP OV2640 camera.',
        features: ['Dual Core 240MHz with Vector Instructions', '512KB SRAM + 8MB Octal PSRAM', 'Native USB OTG and JTAG debug'],
        packageIncludes: ['1 x ESP32-S3 AI Board', '1 x OV2640 Camera Module', '1 x IPEX 2.4GHz Antenna']
    },
    {
        id: 'dev-stm32-f405-wing',
        sku: '3100102',
        name: 'STM32F405 Flight & Motion Controller Development Core',
        category: 'Development Boards',
        subSubCategory: 'ARM Cortex Boards',
        price: 2299,
        originalPrice: 2800,
        rating: 4.7,
        reviewsCount: 7,
        initialStock: 12,
        brand: 'STMicroelectronics',
        weight: '22g',
        warranty: '15 Days Replacement Warranty.',
        datasheetUrl: 'https://www.st.com/resource/en/datasheet/stm32f405rg.pdf',
        description: 'ARM Cortex-M4 32-bit MCU with FPU, 168MHz clock speed, 1MB Flash, 192KB RAM, hardware CAN bus, and multi-channel hardware PWM outputs for robotics.',
        features: ['168MHz Cortex-M4 with Hardware FPU', 'Dual CAN 2.0B interfaces', '6 x Hardware UART channels'],
        packageIncludes: ['1 x STM32F405 Core Board', '2 x 20-pin Gold Plated Headers']
    },

    // ----------------------------------------------------
    // Electronic Components
    // ----------------------------------------------------
    {
        id: 'comp-mosfet-irfz44n-pack',
        sku: '4100201',
        name: 'IRFZ44N N-Channel Power MOSFET 55V 49A TO-220 (Pack of 5)',
        category: 'Electronic Components',
        subSubCategory: 'Power Semiconductors',
        price: 249,
        originalPrice: 320,
        rating: 4.9,
        reviewsCount: 42,
        initialStock: 50,
        brand: 'Infineon',
        warranty: '15 Days Replacement Warranty.',
        datasheetUrl: 'https://www.infineon.com/dgdl/irfz44n.pdf',
        description: 'Industry standard advanced HEXFET Power MOSFETs utilizing advanced processing techniques to achieve extremely low on-resistance per silicon area.',
        features: ['Drain-Source Voltage: 55V', 'Continuous Drain Current: 49A', 'Ultra Low RDS(on): 17.5 mOhm'],
        packageIncludes: ['5 x IRFZ44N N-Channel MOSFETs in Anti-Static Packing']
    },

    // ----------------------------------------------------
    // 3D Printers and Parts
    // ----------------------------------------------------
    {
        id: '3d-hardened-steel-nozzle-kit',
        sku: '5100301',
        name: 'Hardened Steel High-Temp Wear Resistant 0.4mm Nozzle (V6/MK8)',
        category: '3D Printers and Parts',
        subSubCategory: 'Extruder Parts',
        price: 499,
        originalPrice: 650,
        rating: 4.9,
        reviewsCount: 15,
        initialStock: 20,
        brand: 'Rbotics Precision',
        warranty: '30 Days Quality Guarantee against abrasive wear.',
        datasheetUrl: 'https://rbotics.in/datasheets/Hardened-Nozzle-Thermal-Spec.pdf',
        description: 'Engineered specifically for abrasive filament materials including carbon fiber filled PETG, glowing polymers, wood, and fiberglass reinforced nylon.',
        features: ['Rated up to 500°C printing temperature', 'Hardness: 55-60 HRC', 'Precision CNC interior bore'],
        packageIncludes: ['2 x Hardened Steel 0.4mm Nozzles', '1 x Thermal Grease Tube']
    },

    // ----------------------------------------------------
    // Sensors
    // ----------------------------------------------------
    {
        id: 'sensor-bno055-9axis',
        sku: '6100401',
        name: 'BNO055 Intelligent 9-Axis Absolute Orientation Sensor Module',
        category: 'Sensors',
        subSubCategory: 'IMU & Motion Sensors',
        price: 2899,
        originalPrice: 3450,
        rating: 5.0,
        reviewsCount: 18,
        initialStock: 14,
        brand: 'Bosch Sensortec',
        weight: '6g',
        warranty: '15 Days Replacement Warranty.',
        datasheetUrl: 'https://www.bosch-sensortec.com/media/boschsensortec/downloads/datasheets/bst-bno055-ds000.pdf',
        description: 'System in Package (SiP) integrating a triaxial 14-bit accelerometer, a triaxial 16-bit gyroscope, a triaxial geomagnetic sensor and a 32-bit cortex M0+ microcontroller running sensor fusion software.',
        features: ['Outputs Quaternions, Euler angles, Rotation vectors', 'On-chip sensor fusion algorithm', 'I2C and UART telemetry interfaces'],
        packageIncludes: ['1 x BNO055 9-DOF IMU Sensor Module']
    },

    // ----------------------------------------------------
    // Motors | Drivers | Pumps | Actuators
    // ----------------------------------------------------
    {
        id: 'motor-nema17-planetary-gear',
        sku: '7100501',
        name: 'NEMA 17 High-Torque Stepper Motor with 5:1 Planetary Gearbox',
        category: 'Motors | Drivers | Pumps | Actuators',
        subSubCategory: 'Stepper Motors',
        price: 2650,
        originalPrice: 3100,
        rating: 4.8,
        reviewsCount: 10,
        initialStock: 11,
        brand: 'Rbotics Motion',
        weight: '480g',
        warranty: '30 Days Replacement Warranty.',
        datasheetUrl: 'https://rbotics.in/datasheets/Nema17-Planetary-5-1-Datasheet.pdf',
        description: 'Heavy-duty robotic actuator offering massive holding torque with low backlash planetary reduction gearbox, ideal for robotic arms, pan-tilt heads, and CNC positioning.',
        features: ['Gear Ratio: 5.18:1', 'Holding Torque: 4.0 Nm', 'Backlash: < 15 arcmin'],
        packageIncludes: ['1 x NEMA 17 Geared Stepper Motor', '1 x 1-meter shielded wiring cable']
    },

    // ----------------------------------------------------
    // IoT and Wireless Modules
    // ----------------------------------------------------
    {
        id: 'iot-lora-sx1262-node',
        sku: '8100601',
        name: 'SX1262 Long-Range 868MHz / 915MHz LoRa Transceiver Node',
        category: 'IoT and Wireless Modules',
        subSubCategory: 'LoRa Modules',
        price: 1450,
        originalPrice: 1800,
        rating: 4.9,
        reviewsCount: 13,
        initialStock: 22,
        brand: 'Semtech',
        weight: '12g',
        warranty: '15 Days Replacement Warranty.',
        datasheetUrl: 'https://www.semtech.com/products/wireless-rf/lora-connect/sx1262',
        description: 'Ultra-long range communication module capable of reaching over 10km in open air line-of-sight. Perfect for telemetry, smart agriculture, and drone remote stations.',
        features: ['Frequency: 868 / 915 MHz', 'Transmit Power: +22 dBm', 'Ultra-low sleep current: 160 nA'],
        packageIncludes: ['1 x SX1262 LoRa Module', '1 x 868/915MHz High-Gain SMA Antenna']
    },

    // ----------------------------------------------------
    // Prototyping Services
    // ----------------------------------------------------
    {
        id: 'proto-cnc-machining-service',
        sku: '9100701',
        name: 'Custom High-Precision 5-Axis CNC Aluminum Machining Service',
        category: 'Prototyping Services',
        subSubCategory: 'Precision Machining',
        price: 4999,
        originalPrice: 6500,
        rating: 5.0,
        reviewsCount: 31,
        initialStock: 8,
        brand: 'Rbotics Innovations Labs',
        weight: 'Custom',
        warranty: '100% Quality & Tolerance Inspection Certification included.',
        datasheetUrl: 'https://rbotics.in/datasheets/Rbotics-CNC-Tolerances-Guide.pdf',
        description: 'Upload your STEP/IGES CAD model for rapid on-demand 5-axis CNC machining in 6061-T6, 7075-T6 aluminum, brass, or engineering Delrin plastics with ±0.01mm tolerance.',
        features: ['5-Axis Simultaneous Milling', 'Surface Anodizing & Bead Blasting options', 'CMM Inspection Report with every order'],
        packageIncludes: ['Custom CNC Machined Component per Customer CAD Blueprint']
    }
];

// LocalStorage Keys
const PRODUCTS_CATALOG_KEY = 'rbotics_products_catalog';
const INVENTORY_STORAGE_KEY = 'rbotics_product_inventory';

// Load all products with catalog persistence
export const getProductsCatalog = (): ProductItem[] => {
    try {
        const stored = localStorage.getItem(PRODUCTS_CATALOG_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        }
    } catch {
        // fallback
    }

    // Default initialization
    try {
        localStorage.setItem(PRODUCTS_CATALOG_KEY, JSON.stringify(INITIAL_PRODUCTS));
    } catch {
        // ignore
    }
    return INITIAL_PRODUCTS;
};

// Save single product update (Admin modification)
export const saveProduct = (updatedProduct: ProductItem): void => {
    const catalog = getProductsCatalog();
    const index = catalog.findIndex(p => p.sku === updatedProduct.sku);

    if (index >= 0) {
        catalog[index] = { ...catalog[index], ...updatedProduct };
    } else {
        catalog.unshift(updatedProduct);
    }

    try {
        localStorage.setItem(PRODUCTS_CATALOG_KEY, JSON.stringify(catalog));
    } catch {
        // ignore
    }

    // Also sync inventory stock
    if (updatedProduct.initialStock !== undefined) {
        restockProduct(updatedProduct.sku, updatedProduct.initialStock);
    }

    // Dispatch cross-tab & live updates
    window.dispatchEvent(new Event('products-catalog-updated'));
    window.dispatchEvent(new Event('inventory-updated'));
};

// Delete product (Admin)
export const deleteProduct = (sku: string): void => {
    const catalog = getProductsCatalog().filter(p => p.sku !== sku);
    try {
        localStorage.setItem(PRODUCTS_CATALOG_KEY, JSON.stringify(catalog));
    } catch {
        // ignore
    }
    window.dispatchEvent(new Event('products-catalog-updated'));
};

// Helper functions for stock inventory management with localStorage
export const getInventory = (): Record<string, number> => {
    try {
        const stored = localStorage.getItem(INVENTORY_STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch {
        // fallback
    }

    // Default initialization from catalog
    const catalog = getProductsCatalog();
    const initialMap: Record<string, number> = {};
    catalog.forEach(p => {
        initialMap[p.sku] = p.initialStock;
    });
    try {
        localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(initialMap));
    } catch {
        // ignore
    }
    return initialMap;
};

export const getProductStock = (sku: string): number => {
    const inv = getInventory();
    if (inv[sku] !== undefined) {
        return inv[sku];
    }
    const product = getProductsCatalog().find(p => p.sku === sku);
    return product ? product.initialStock : 0;
};

// If order confirmed, minus from the stock
export const deductStock = (sku: string, qty: number): boolean => {
    const inv = getInventory();
    const current = inv[sku] !== undefined ? inv[sku] : 0;
    const updated = Math.max(0, current - qty);
    inv[sku] = updated;

    try {
        localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(inv));
    } catch {
        // ignore
    }

    // Also sync catalog initialStock
    const catalog = getProductsCatalog();
    const pIndex = catalog.findIndex(p => p.sku === sku);
    if (pIndex >= 0) {
        catalog[pIndex].initialStock = updated;
        try {
            localStorage.setItem(PRODUCTS_CATALOG_KEY, JSON.stringify(catalog));
        } catch {
            // ignore
        }
    }

    window.dispatchEvent(new Event('inventory-updated'));
    window.dispatchEvent(new Event('products-catalog-updated'));
    return true;
};

export const restockProduct = (sku: string, newStock: number): void => {
    const inv = getInventory();
    inv[sku] = newStock;
    try {
        localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(inv));
    } catch {
        // ignore
    }

    const catalog = getProductsCatalog();
    const pIndex = catalog.findIndex(p => p.sku === sku);
    if (pIndex >= 0) {
        catalog[pIndex].initialStock = newStock;
        try {
            localStorage.setItem(PRODUCTS_CATALOG_KEY, JSON.stringify(catalog));
        } catch {
            // ignore
        }
    }

    window.dispatchEvent(new Event('inventory-updated'));
    window.dispatchEvent(new Event('products-catalog-updated'));
};
