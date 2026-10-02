export interface ProductItem {
    id: string;
    sku: string;
    name: string;
    category: string;
    subSubCategory: string;
    price: number;
    rating: number;
    reviewsCount: number;
    initialStock: number;
    voltage: string;
    capacity: string;
    dischargeRate: string;
    connector: string;
    brand: string;
    hasBms: boolean;
    description: string;
    features: string[];
    packageIncludes: string[];
    weight: string;
}

export const INITIAL_PRODUCTS: ProductItem[] = [
    // 1 Cell Li-Ion Battery Pack (3.6V~4.2V)
    {
        id: '1cell-2000mah',
        sku: '1553350',
        name: 'Pro-Range A Grade NMC N18650CH 3.7V 2000mAh 3C 1S1P Li-Ion Battery Pack',
        category: 'Lithium Ion (Li-ion) Battery Pack',
        subSubCategory: '1 Cell Li-Ion Battery Pack (3.6V~4.2V)',
        price: 259,
        rating: 5.0,
        reviewsCount: 0,
        initialStock: 18,
        voltage: '3.7V',
        capacity: '2000 mAh',
        dischargeRate: '3C',
        connector: '2 Pin JST-XH',
        brand: 'Pro-Range',
        hasBms: false,
        weight: '48g',
        description: 'Pro-Range batteries are known for performance, reliability, and price. It is no surprise to us that Orange Li-Ion packs are the go-to pack for those in the know. Pro-Range A Grade NMC N18650CH 3.7V 2000mAh 3C 1S1P Li-Ion Battery Pack is the new product from Pro-Range brand. It is very convenient to install the battery in your project to fulfill your requirement with rated capacity.',
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
        category: 'Lithium Ion (Li-ion) Battery Pack',
        subSubCategory: '1 Cell Li-Ion Battery Pack (3.6V~4.2V)',
        price: 259,
        rating: 4.8,
        reviewsCount: 3,
        initialStock: 0, // Out of Stock example matching user screenshot
        voltage: '3.7V',
        capacity: '2200 mAh',
        dischargeRate: '3C',
        connector: '2 Pin JST-XH',
        brand: 'Pro-Range',
        hasBms: false,
        weight: '50g',
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
        category: 'Lithium Ion (Li-ion) Battery Pack',
        subSubCategory: '1 Cell Li-Ion Battery Pack (3.6V~4.2V)',
        price: 259,
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
        category: 'Lithium Ion (Li-ion) Battery Pack',
        subSubCategory: '1 Cell Li-Ion Battery Pack (3.6V~4.2V)',
        price: 519,
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
        id: '1cell-5000mah-21700',
        sku: '1553354',
        name: 'Pro-Range A Grade NMC N21700CG-50 3.7V 5000mAh 3C 1S1P Li-Ion Battery Pack',
        category: 'Lithium Ion (Li-ion) Battery Pack',
        subSubCategory: '1 Cell Li-Ion Battery Pack (3.6V~4.2V)',
        price: 1889,
        rating: 5.0,
        reviewsCount: 4,
        initialStock: 8,
        voltage: '3.7V',
        capacity: '5000 mAh',
        dischargeRate: '3C',
        connector: 'Open Wire / XT60',
        brand: 'Pro-Range',
        hasBms: true,
        weight: '75g',
        description: 'Massive capacity 21700 form factor cell pack providing 5000mAh in a single compact unit. Perfect for long runtime autonomous nodes and telemetry units.',
        features: [
            'Next-generation 21700 cylindrical architecture',
            '5000mAh huge single cell capacity',
            'Integrated PCM and silicon high flex wires'
        ],
        packageIncludes: [
            '1 x Pro-Range N21700CG-50 3.7V 5000mAh 1S1P Battery Pack'
        ]
    },

    // 2 Cell Li-Ion Battery Pack (7.4V~8.4V)
    {
        id: '2cell-2200mah-74v',
        sku: '1553360',
        name: 'Orange 7.4V 2200mAh 2S 20C Li-Ion Battery Pack with XT60',
        category: 'Lithium Ion (Li-ion) Battery Pack',
        subSubCategory: '2 Cell Li-Ion Battery Pack (7.4V~8.4V)',
        price: 749,
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
        description: '7.4V 2S battery pack designed for RC robots, transmitter remotes, and embedded micro-controllers needing dual-cell voltage.',
        features: ['XT60 discharge plug', 'JST-XH balance plug', 'High discharge output'],
        packageIncludes: ['1 x 7.4V 2200mAh 2S Li-Ion Pack']
    },
    {
        id: '2cell-5000mah-74v',
        sku: '1553361',
        name: 'Pro-Range 7.4V 5000mAh 2S2P Heavy Duty Li-Ion Pack',
        category: 'Lithium Ion (Li-ion) Battery Pack',
        subSubCategory: '2 Cell Li-Ion Battery Pack (7.4V~8.4V)',
        price: 1399,
        rating: 4.9,
        reviewsCount: 8,
        initialStock: 10,
        voltage: '7.4V',
        capacity: '5000 mAh',
        dischargeRate: '15C',
        connector: 'XT60',
        brand: 'Pro-Range',
        hasBms: true,
        weight: '215g',
        description: 'Dual-parallel 2S configuration providing prolonged operating hours for mobile robotics chassis.',
        features: ['5000mAh prolonged capacity', 'Smart 2S BMS included'],
        packageIncludes: ['1 x 7.4V 5000mAh 2S2P Battery Pack']
    },

    // 3 Cell 12V Li-Ion Battery Pack (11.1V~12.6V)
    {
        id: '3cell-11v-5000mah',
        sku: '1553370',
        name: 'Orange 11.1V 12V 5000mAh 3S Li-Ion Pack with DC Jack & XT60',
        category: 'Lithium Ion (Li-ion) Battery Pack',
        subSubCategory: '3 Cell 12V Li-Ion Battery Pack (11.1V~12.6V)',
        price: 1850,
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
        description: 'Direct 12V replacement Lithium-ion pack for CCTV, routers, ROV electronics, and Arduino/Raspberry Pi robotics.',
        features: ['12V nominal output', 'Dual output plugs (XT60 + DC 5.5mm)', 'Overcharge & Overdischarge cutoff'],
        packageIncludes: ['1 x Orange 11.1V 5000mAh 3S Battery Pack']
    },

    // 4 Cell 15V Li-Ion Battery Pack (14.8V~16.8V)
    {
        id: '4cell-14v-5000mah',
        sku: '1553380',
        name: 'Pro-Range 14.8V 5000mAh 4S Li-Ion High Discharge Pack',
        category: 'Lithium Ion (Li-ion) Battery Pack',
        subSubCategory: '4 Cell 15V Li-Ion Battery Pack (14.8V~16.8V)',
        price: 2450,
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
        description: 'Standard 4S pack providing powerful energy delivery for quadcopters, drone motors, and high-thrust brushless underwater thrusters.',
        features: ['14.8V nominal voltage', 'XT90 anti-spark connection', 'Low internal resistance'],
        packageIncludes: ['1 x Pro-Range 14.8V 5000mAh 4S Pack']
    },

    // Custom Battery Pack
    {
        id: 'custom-batt-pack',
        sku: '1553390',
        name: 'Rbotics Custom Engineered Industrial Battery Pack (12V-72V)',
        category: 'Lithium Ion (Li-ion) Battery Pack',
        subSubCategory: 'Custom Battery Pack',
        price: 9999,
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
        description: 'Precision engineered custom battery packs assembled with spot-welded pure nickel strips, active smart BMS, waterproof cases, and custom telemetry output.',
        features: ['Custom dimensions & voltage', 'CAN-Bus / Bluetooth telemetry options', 'Grade A cell matching'],
        packageIncludes: ['1 x Custom Engineered Battery Pack with Test Certification']
    },

    // 5 ~ 7 Cell Li-Ion Battery Pack
    {
        id: '6cell-22v-15000mah',
        sku: '1553395',
        name: 'Orange 22.2V 15000mAh 6S Li-Ion Drone Heavy Lifter Pack',
        category: 'Lithium Ion (Li-ion) Battery Pack',
        subSubCategory: '5 ~ 7 Cell Li-Ion Battery Pack',
        price: 13500,
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
        description: 'Ultra high density 6S battery system engineered for agriculture spraying drones and commercial inspection aircraft.',
        features: ['22.2V high voltage system', '15000mAh extreme flight time', 'Flame-retardant outer wrap'],
        packageIncludes: ['1 x Orange 22.2V 15000mAh 6S Battery Pack']
    }
];

// Helper functions for stock inventory management with localStorage
const INVENTORY_STORAGE_KEY = 'rbotics_product_inventory';

export const getInventory = (): Record<string, number> => {
    try {
        const stored = localStorage.getItem(INVENTORY_STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch {
        // fallback
    }

    // Default initialization
    const initialMap: Record<string, number> = {};
    INITIAL_PRODUCTS.forEach(p => {
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
    return inv[sku] !== undefined ? inv[sku] : 0;
};

export const deductStock = (sku: string, qty: number): boolean => {
    const inv = getInventory();
    const current = inv[sku] !== undefined ? inv[sku] : 0;
    const updated = Math.max(0, current - qty);
    inv[sku] = updated;
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(inv));
    window.dispatchEvent(new Event('inventory-updated'));
    return true;
};

export const restockProduct = (sku: string, newStock: number): void => {
    const inv = getInventory();
    inv[sku] = newStock;
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(inv));
    window.dispatchEvent(new Event('inventory-updated'));
};
