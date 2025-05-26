import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      dashboard: 'Dashboard',
      home: 'Home',
      clients: 'Clients',
      orders: 'Orders',
      products: 'Products',
      suppliers: 'Suppliers',
      users: 'Users',
      doctors: 'Doctors',
      logout: 'Logout',
      
      // Auth
      login: 'Login',
      username: 'Username',
      password: 'Password',
      
      // Actions
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      print: 'Print',
      actions: 'Actions',
      currency: 'MAD',
      next: 'Next',
      previous: 'Previous',
      
      // Order Form
      editorder: 'Edit Order',
      neworder: 'New Order',
      orderDate: 'Order Date',
      deliveryDate: 'Delivery Date',
      customerName: 'Client Name',
      orderState: 'Order State',
      inProgress: 'In Progress',
      delivered: 'Delivered',
      examinedBy: 'Examined By',
      socialSecurity: 'Social Security',
      orderInformation: 'Order Information',
      eyeMeasurements: 'Eye Measurements',
      delete_confirmation_order: 'Are you sure you want to delete this order?',
      
      // Eye Measurements
      leftEye: 'Left Eye',
      rightEye: 'Right Eye',
      sph: 'SPH',
      cyl: 'CYL',
      axis: 'Axis',
      add: 'ADD',
      ep: 'EP',
      hp: 'HP',
      prism: 'Prism',
      prismAxis: 'Prism Axis',
      
      // Vision Types
      visionType: 'Vision Type',
      nearSightedness: 'Near-sightedness',
      farSightedness: 'Far-sightedness',
      progressive: 'Progressive',
      solar: 'Solar',
      
      // Client
      firstname: 'First Name',
      lastname: 'Last Name',
      gender: 'Gender',
      profession: 'Profession',
      phone: 'Phone Number',
      debit: 'Debit',
      male: 'Male',
      female: 'Female',
      addnewclient: 'Add New Client',
      newclient: 'New Client',
      editclient: 'Edit Client',
      delete_confirmation_client: 'Are you sure you want to delete this client?',
      clientInformation: 'Client Information',
      
      // Dashboard
      welcomeBack: 'Welcome Back',
      totalClients: 'Total Clients',
      totalOrders: 'Total Orders',
      totalRevenue: 'Total Revenue',
      activeSuppliers: 'Active Suppliers',
      
      // Products
      addProduct: 'Add Product',
      editProduct: 'Edit Product',
      reference: 'Reference',
      productName: 'Product Name',
      brand: 'Brand',
      sellingPrice: 'Selling Price',
      purchasePrice: 'Purchase Price',
      inStock: 'In Stock',
      
      // New translations
      addneworder: 'Add New Order',
      neworder: 'New Order',
      
      // Product Modal
      productInformation: 'Product Information',
      glassInformation: 'Glass Information',
      productType: 'Product Type',
      color: 'Color',
      category: 'Category',
      lensType: 'Lens Type',
      material: 'Material',
      glassType: 'Glass Type',
      select: 'Select...',
      delete_confirmation_product: 'Are you sure you want to delete this product?',
      
      // Product Types
      frame: 'Frame',
      glass: 'Glass',
      lens: 'Lens',
      'glass product': 'Glass Product',
      'lens product': 'Lens Product',
      other: 'Other',
      
      // Categories
      man: 'Man',
      woman: 'Woman',
      kid: 'Kid',
      
      // Lens Types
      rigid: 'Rigid',
      flexible: 'Flexible',
      
      // Materials
      metal: 'Metal',
      plastic: 'Plastic',
      
      // Glass Types
      miniral: 'Miniral',
      organic: 'Organic',
      polycarbonat: 'Polycarbonat',
      
      // Vision Types
      'near-sightedness': 'Near-sightedness',
      'far-sightedness': 'Far-sightedness',
      
      // Doctor
      addnewdoctor: 'Add New Doctor',
      newdoctor: 'New Doctor',
      editdoctor: 'Edit Doctor',
      specialty: 'Specialty',
      email: 'Email',
      address: 'Address',
      delete_confirmation_doctor: 'Are you sure you want to delete this doctor?',
      
      // Search
      search: 'Search',
      searchDoctors: 'Search doctors...',
      searchClients: 'Search clients...',
      searchProducts: 'Search products...',
      
      // Glass specifications
      glassSpecifications: 'Glass Specifications',
      mineral: 'Mineral',
      polycarbonate: 'Polycarbonate',
      treatment: 'Treatment',
      white: 'White',
      antiBlueLight: 'Anti-Blue Light',
      antiReflexion: 'Anti-Reflexion',
      mirrored: 'Mirrored',
      transitions: 'Transitions',
      uniColor: 'Uni Color',
      degraded: 'Degraded',
      polarized: 'Polarized',
      index: 'Index',

      //Add Products
      unitPrice: 'Unit Price',
      quantity: 'Quantity',
      subtotal: 'Subtotal',
      totalAmount: 'Total Amount',
      selectProducts: 'Select Products',
      close: 'Close',
    }
  },
  fr: {
    translation: {
      // Navigation
      dashboard: 'Tableau de bord',
      home: 'Accueil',
      clients: 'Clients',
      orders: 'Commandes',
      products: 'Produits',
      suppliers: 'Fournisseurs',
      users: 'Utilisateurs',
      doctors: 'Médecins',
      logout: 'Déconnexion',
      
      // Auth
      login: 'Connexion',
      username: 'Nom d\'utilisateur',
      password: 'Mot de passe',
      
      // Actions
      edit: 'Modifier',
      delete: 'Supprimer',
      save: 'Enregistrer',
      cancel: 'Annuler',
      print: 'Imprimer',
      actions: 'Actions',
      currency: 'MAD',
      next: 'Suivant',
      previous: 'Précédent',
      
      // Order Form
      editorder: 'Modifier la commande',
      neworder: 'Nouvelle commande',
      orderDate: 'Date de commande',
      deliveryDate: 'Date de livraison',
      customerName: 'Nom du client',
      orderState: 'État de la commande',
      inProgress: 'En cours',
      delivered: 'Livré',
      examinedBy: 'Examiné par',
      socialSecurity: 'Sécurité sociale',
      orderInformation: 'Informations de la Commande',
      eyeMeasurements: 'Mesures des Yeux',
      delete_confirmation_order: 'Êtes-vous sûr de vouloir supprimer cette commande ?',
      
      // Eye Measurements
      leftEye: 'Œil gauche',
      rightEye: 'Œil droit',
      sph: 'SPH',
      cyl: 'CYL',
      axis: 'Axe',
      add: 'ADD',
      ep: 'EP',
      hp: 'HP',
      prism: 'Prisme',
      prismAxis: 'Axe du prisme',
      
      // Vision Types
      visionType: 'Type de vision',
      nearSightedness: 'Myopie',
      farSightedness: 'Hypermétropie',
      progressive: 'Progressif',
      solar: 'Solaire',
      
      // Client
      firstname: 'Prénom',
      lastname: 'Nom',
      gender: 'Genre',
      profession: 'Profession',
      phone: 'Numéro de Téléphone',
      debit: 'Débit',
      male: 'Homme',
      female: 'Femme',
      addnewclient: 'Ajouter un Client',
      newclient: 'Nouveau Client',
      editclient: 'Modifier le Client',
      delete_confirmation_client: 'Êtes-vous sûr de vouloir supprimer ce client ?',
      clientInformation: 'Informations du Client',
      
      // Dashboard
      welcomeBack: 'Bienvenue',
      totalClients: 'Total Clients',
      totalOrders: 'Total Commandes',
      totalRevenue: 'Revenu Total',
      activeSuppliers: 'Fournisseurs Actifs',
      
      // Products
      addProduct: 'Ajouter un Produit',
      editProduct: 'Modifier le Produit',
      reference: 'Référence',
      productName: 'Nom du Produit',
      brand: 'Marque',
      sellingPrice: 'Prix de Vente',
      purchasePrice: 'Prix d\'Achat',
      inStock: 'En Stock',
      
      // New translations
      addneworder: 'Ajouter une Commande',
      neworder: 'Nouvelle Commande',
      
      // Product Modal
      productInformation: 'Informations du Produit',
      glassInformation: 'Informations des Verres',
      productType: 'Type de Produit',
      color: 'Couleur',
      category: 'Catégorie',
      lensType: 'Type de Verre',
      material: 'Matériau',
      glassType: 'Type de Verre',
      select: 'Sélectionner...',
      delete_confirmation_product: 'Êtes-vous sûr de vouloir supprimer ce produit ?',
      
      // Product Types
      frame: 'Monture',
      glass: 'Verre',
      lens: 'Lentille',
      'glass product': 'Produit Verre',
      'lens product': 'Produit Lentille',
      other: 'Autre',
      
      // Categories
      man: 'Homme',
      woman: 'Femme',
      kid: 'Enfant',
      
      // Lens Types
      rigid: 'Rigide',
      flexible: 'Flexible',
      
      // Materials
      metal: 'Métal',
      plastic: 'Plastique',
      
      // Glass Types
      miniral: 'Minéral',
      organic: 'Organique',
      polycarbonat: 'Polycarbonate',
      
      // Vision Types
      'near-sightedness': 'Myopie',
      'far-sightedness': 'Hypermétropie',
      
      // Doctor
      addnewdoctor: 'Ajouter un Médecin',
      newdoctor: 'Nouveau Médecin',
      editdoctor: 'Modifier le Médecin',
      specialty: 'Spécialité',
      email: 'Email',
      address: 'Adresse',
      delete_confirmation_doctor: 'Êtes-vous sûr de vouloir supprimer ce médecin ?',
      
      // Search
      search: 'Rechercher',
      searchDoctors: 'Rechercher des médecins...',
      searchClients: 'Rechercher des clients...',
      searchProducts: 'Rechercher des produits...',
      
      // Glass specifications
      glassSpecifications: 'Spécifications du verre',
      mineral: 'Minéral',
      polycarbonate: 'Polycarbonate',
      treatment: 'Traitement',
      white: 'Blanc',
      antiBlueLight: 'Anti-Lumière Bleue',
      antiReflexion: 'Anti-Reflet',
      mirrored: 'Miroité',
      transitions: 'Transitions',
      uniColor: 'Uni Couleur',
      degraded: 'Dégradé',
      polarized: 'Polarisé',
      index: 'Indice',

      //Add Products
      unitPrice: 'Prix unitaire',
      quantity: 'Quantité',
      subtotal: 'Subtotal',
      totalAmount: 'Montant total',
      selectProducts: 'Sélectionner des produits',
      close: 'Fermer',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
