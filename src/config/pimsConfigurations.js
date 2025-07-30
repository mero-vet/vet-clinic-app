// PIMS Configuration Registry
// This file defines the UI/UX elements, workflows, and terminology for each PIMS

const pimsConfigurations = {
    // Cornerstone - Windows Classic theme
    cornerstone: {
        name: "Cornerstone",
        colors: {
            primary: "#000080", // Navy blue
            secondary: "#c0c0c0", // Silver
            background: "#c0c0c0", // Silver
            text: "#000000", // Black
            border: "#808080", // Gray
            highlight: "#0000ff", // Blue
        },
        typography: {
            fontFamily: "'MS Sans Serif', 'Segoe UI', Tahoma, sans-serif",
            fontSize: "12px",
        },
        appearance: {
            borderRadius: "0",
            buttonStyle: "3d", // 3D, raised buttons
        },
        logo: {
            text: "Cornerstone",
            icon: "/icons/cornerstone.png",
        },
        icons: {
            style: "classic",
            size: "24px",
        },
        layout: {
            type: "windows-classic",
            menuPosition: "top",
            navigationStyle: "icon-bar",
        },
        screenLabels: {
            checkin: "Check-In/Out",
            scheduler: "Scheduler",
            notes: "Notes",
            services: "Services",
            invoices: "Invoices",
            records: "Medical Records",
            inventory: "Inventory",
            communications: "Communications",
            pharmacy: "Pharmacy",
            reports: "Reports",
        },
        terminology: {
            patient: "Patient",
            client: "Client",
            appointment: "Appointment",
            service: "Service",
            medication: "Medication",
            prescription: "Prescription",
            invoice: "Invoice",
        },
    },

    // Avimark - Windows Modern theme with ribbon
    avimark: {
        name: "Avimark",
        colors: {
            primary: "#A70000", // Dark red
            secondary: "#FFFFFF", // White
            background: "#F0F0F0", // Light gray
            text: "#000000", // Black
            border: "#CCCCCC", // Light gray
            highlight: "#D32F2F", // Red
        },
        typography: {
            fontFamily: "'Segoe UI', Arial, sans-serif",
            fontSize: "13px",
        },
        appearance: {
            borderRadius: "2px",
            buttonStyle: "flat", // Flat buttons with hover effects
        },
        logo: {
            text: "Avimark",
            icon: "/icons/avimark.png",
        },
        icons: {
            style: "modern",
            size: "22px",
        },
        layout: {
            type: "ribbon",
            menuPosition: "top",
            navigationStyle: "ribbon",
        },
        screenLabels: {
            checkin: "Check-In",
            scheduler: "Appointments",
            notes: "Clinical Notes",
            services: "Treatments",
            invoices: "Billing",
            records: "Patient Records",
            inventory: "Inventory Manager",
            communications: "Client Comm",
            pharmacy: "Prescriptions",
            reports: "Analysis",
        },
        terminology: {
            patient: "Patient",
            client: "Owner",
            appointment: "Visit",
            service: "Treatment",
            medication: "Drug",
            prescription: "Rx",
            invoice: "Bill",
        },
    },

    // EasyVet - Web-based modern UI
    easyvet: {
        name: "EasyVet",
        colors: {
            primary: "#4CAF50", // Green
            secondary: "#E8F5E9", // Light green
            background: "#FFFFFF", // White
            text: "#424242", // Dark gray
            border: "#E0E0E0", // Light gray
            highlight: "#66BB6A", // Light green
        },
        typography: {
            fontFamily: "'Roboto', 'Open Sans', Arial, sans-serif",
            fontSize: "14px",
        },
        appearance: {
            borderRadius: "4px",
            buttonStyle: "material", // Material design style
        },
        logo: {
            text: "easyVet",
            icon: "/icons/easyvet.png",
        },
        icons: {
            style: "minimal",
            size: "24px",
        },
        layout: {
            type: "card-based",
            menuPosition: "bottom",
            navigationStyle: "bottom-nav",
        },
        screenLabels: {
            checkin: "Reception",
            scheduler: "Calendar",
            notes: "Clinical Notes",
            services: "Treatments",
            invoices: "Billing",
            records: "Health Records",
            inventory: "Stock Control",
            communications: "Messaging",
            pharmacy: "Pharmacy",
            reports: "Analytics",
        },
        terminology: {
            patient: "Animal",
            client: "Owner",
            appointment: "Booking",
            service: "Treatment",
            medication: "Product",
            prescription: "Prescription",
            invoice: "Invoice",
        },
    },

    // IntraVet - Windows/Web hybrid interface
    intravet: {
        name: "IntraVet",
        colors: {
            primary: "#1565C0", // Dark blue
            secondary: "#FF8F00", // Amber/Orange
            background: "#F5F5F5", // Off-white
            text: "#333333", // Dark gray
            border: "#BBBBBB", // Medium gray
            highlight: "#2196F3", // Blue
        },
        typography: {
            fontFamily: "'Trebuchet MS', 'Tahoma', Arial, sans-serif",
            fontSize: "13px",
        },
        appearance: {
            borderRadius: "3px",
            buttonStyle: "gradient", // Gradient buttons
        },
        logo: {
            text: "IntraVet",
            icon: "/icons/intravet.png",
        },
        icons: {
            style: "colored",
            size: "20px",
        },
        layout: {
            type: "tree-tabs",
            menuPosition: "left",
            navigationStyle: "tree-menu",
        },
        screenLabels: {
            checkin: "Registration",
            scheduler: "Calendar",
            notes: "Visit Notes",
            services: "Procedures",
            invoices: "Accounts",
            records: "Medical Files",
            inventory: "Stock",
            communications: "Client Connect",
            pharmacy: "Medications",
            reports: "Practice Reports",
        },
        terminology: {
            patient: "Patient",
            client: "Client",
            appointment: "Visit",
            service: "Procedure",
            medication: "Pharmaceutical",
            prescription: "Script",
            invoice: "Account",
        },
    },

    // Covetrus Pulse - Cloud-based modern SaaS interface
    covetrus: {
        name: "Covetrus (XP)",
        colors: {
            primary: "#1d4a9e", // Windows XP blue nav bar
            secondary: "#f05a28", // Orange accent
            background: "#f0f4fb", // XP light blue-ish background
            text: "#000000", // Black text
            border: "#c9c9c9", // Light grey border
            highlight: "#1d4a9e", // Same as primary for focus rings
        },
        typography: {
            fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
            fontSize: "14px",
        },
        appearance: {
            borderRadius: "4px",
            buttonStyle: "flat", // XP flatish buttons
        },
        logo: {
            text: "Covetrus Pulse",
            icon: "/icons/covetrus.png",
        },
        icons: {
            style: "outlined",
            size: "24px",
        },
        layout: {
            type: "modern-saas",
            menuPosition: "top",
            navigationStyle: "xp-grid",
        },
        screenLabels: {
            checkin: "Patient Flow",
            scheduler: "Appointments",
            notes: "Medical Notes",
            services: "Clinical Care",
            invoices: "Financial",
            records: "Health Hub",
            inventory: "Inventory",
            communications: "Client Engage",
            pharmacy: "Prescriptions",
            reports: "Analytics Center",
        },
        terminology: {
            patient: "Patient",
            client: "Pet Parent",
            appointment: "Visit",
            service: "Care Item",
            medication: "Medication",
            prescription: "Rx",
            invoice: "Transaction",
        },
    },
};

export default pimsConfigurations; 