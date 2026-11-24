const XLSX = require('xlsx');

// Read MASTER workbook
const wb = XLSX.readFile('manual-test-cases/test-cases-auth.xlsx');
console.log('Existing sheets:', wb.SheetNames);

const moduleName = 'Electronics';
const today = new Date().toISOString().split('T')[0];

// Headers matching MASTER workbook structure
const headers = [
  'TC ID', 'Module', 'Feature', 'Scenario', 'Preconditions',
  'Test Steps', 'Expected Result', 'Priority', 'Status', 'Type',
  'Automation', 'Tags', 'Requirements', 'Source File', 'Created By', 'Created Date'
];

// Electronics test cases (29 total: 15 Positive, 6 Negative, 8 Boundary)
const testCases = [
  headers,

  // ========== POSITIVE TEST CASES (15) ==========
  ['ELEC-001', 'Electronics', 'Category Navigation - Header', 'Navigate to Electronics category from header menu', 'User is on home page', '1. Click "Electronics" in header top menu\n2. Wait for page load', 'Electronics category page loads with title "Demo Web Shop. Electronics" and heading "Electronics"', 'Critical', 'Not Executed', 'Positive', 'Yes', 'smoke,regression,critical', 'REQ-NAV-001', 'page-objects/page-elements/home-page.json', 'manual-test-case-generator agent', today],
  ['ELEC-002', 'Electronics', 'Category Navigation - Sidebar', 'Navigate to Electronics category from sidebar navigation', 'User is on home page', '1. Click "Electronics" in sidebar category navigation\n2. Wait for page load', 'Electronics category page loads with title "Demo Web Shop. Electronics" and heading "Electronics"', 'Critical', 'Not Executed', 'Positive', 'Yes', 'smoke,regression', 'REQ-NAV-002', 'page-objects/page-elements/home-page.json', 'manual-test-case-generator agent', today],
  ['ELEC-003', 'Electronics', 'Category Navigation - Direct URL', 'Access Electronics category via direct URL', 'Browser is open', '1. Navigate to /electronics\n2. Wait for page load', 'Electronics category page loads with correct title and heading', 'High', 'Not Executed', 'Positive', 'Yes', 'regression,api', 'REQ-NAV-003', 'page-objects/page-elements/home-page.json', 'manual-test-case-generator agent', today],
  ['ELEC-004', 'Electronics', 'Product Listing', 'Verify products are displayed in Electronics category', 'User is on Electronics category page', '1. Observe product grid\n2. Verify product cards are visible', 'Product cards with name, price, and image are displayed', 'Critical', 'Not Executed', 'Positive', 'Yes', 'smoke,regression', 'REQ-PROD-001', 'page-objects/page-elements/electronics-page.json', 'manual-test-case-generator agent', today],
  ['ELEC-005', 'Electronics', 'Product Navigation', 'Click product navigates to product detail page', 'User is on Electronics category page with products visible', '1. Click on first product title link\n2. Wait for page load', 'Product detail page loads with product name, price, description, and add to cart button', 'Critical', 'Not Executed', 'Positive', 'Yes', 'smoke,regression,critical', 'REQ-PROD-002', 'page-objects/page-elements/electronics-page.json', 'manual-test-case-generator agent', today],
  ['ELEC-006', 'Electronics', 'Sorting - Name A-Z', 'Sort products by Name A to Z', 'User is on Electronics category page', '1. Select "Name: A to Z" from sort dropdown\n2. Wait for page reload', 'Products reorder alphabetically ascending by name', 'Medium', 'Not Executed', 'Positive', 'Candidate', 'regression', 'REQ-SORT-001', 'page-objects/page-elements/electronics-page.json', 'manual-test-case-generator agent', today],
  ['ELEC-007', 'Electronics', 'Sorting - Name Z-A', 'Sort products by Name Z to A', 'User is on Electronics category page', '1. Select "Name: Z to A" from sort dropdown\n2. Wait for page reload', 'Products reorder alphabetically descending by name', 'Medium', 'Not Executed', 'Positive', 'Candidate', 'regression', 'REQ-SORT-002', 'page-objects/page-elements/electronics-page.json', 'manual-test-case-generator agent', today],
  ['ELEC-008', 'Electronics', 'Sorting - Price Low-High', 'Sort products by Price Low to High', 'User is on Electronics category page', '1. Select "Price: Low to High" from sort dropdown\n2. Wait for page reload', 'Products reorder by price ascending', 'Medium', 'Not Executed', 'Positive', 'Candidate', 'regression', 'REQ-SORT-003', 'page-objects/page-elements/electronics-page.json', 'manual-test-case-generator agent', today],
  ['ELEC-009', 'Electronics', 'Sorting - Price High-Low', 'Sort products by Price High to Low', 'User is on Electronics category page', '1. Select "Price: High to Low" from sort dropdown\n2. Wait for page reload', 'Products reorder by price descending', 'Medium', 'Not Executed', 'Positive', 'Candidate', 'regression', 'REQ-SORT-004', 'page-objects/page-elements/electronics-page.json', 'manual-test-case-generator agent', today],
  ['ELEC-010', 'Electronics', 'Pagination - Next Page', 'Navigate to next page of products', 'User is on Electronics category page with multiple pages', '1. Click "Next" pagination link\n2. Wait for page load', 'Second page of products loads with different products', 'Low', 'Not Executed', 'Positive', 'Candidate', 'regression', 'REQ-PAGE-001', 'page-objects/page-elements/electronics-page.json', 'manual-test-case-generator agent', today],
  ['ELEC-011', 'Electronics', 'Add to Cart from Category', 'Add product to cart from category page', 'User is on Electronics category page', '1. Click "Add to cart" on first product\n2. Verify notification', 'Success notification appears, cart count increments', 'Critical', 'Not Executed', 'Positive', 'Yes', 'smoke,regression,critical', 'REQ-CART-001', 'page-objects/page-elements/electronics-page.json', 'manual-test-case-generator agent', today],
  ['ELEC-012', 'Electronics', 'Add to Wishlist from Category', 'Add product to wishlist from category page', 'User is on Electronics category page', '1. Click "Add to wishlist" on first product\n2. Verify notification', 'Success notification appears, wishlist count increments', 'Medium', 'Not Executed', 'Positive', 'Candidate', 'regression', 'REQ-WISH-001', 'page-objects/page-elements/electronics-page.json', 'manual-test-case-generator agent', today],
  ['ELEC-013', 'Electronics', 'Breadcrumb Navigation', 'Verify breadcrumbs on Electronics category page', 'User is on Electronics category page', '1. Observe breadcrumb trail', 'Breadcrumb shows: Home > Electronics', 'Medium', 'Not Executed', 'Positive', 'Candidate', 'regression', 'REQ-NAV-004', 'page-objects/page-elements/home-page.json', 'manual-test-case-generator agent', today],
  ['ELEC-014', 'Electronics', 'Breadcrumb Click Home', 'Click Home in breadcrumb navigates to home page', 'User is on Electronics category page', '1. Click "Home" in breadcrumb\n2. Wait for page load', 'Navigates to home page (/)', 'Medium', 'Not Executed', 'Positive', 'Candidate', 'regression', 'REQ-NAV-005', 'page-objects/page-elements/home-page.json', 'manual-test-case-generator agent', today],
  ['ELEC-015', 'Electronics', 'Cross-Category Navigation', 'Navigate from Electronics to another category', 'User is on Electronics category page', '1. Click "Computers" in header menu\n2. Wait for page load', 'Navigates to Computers category page', 'Medium', 'Not Executed', 'Positive', 'Candidate', 'regression', 'REQ-NAV-006', 'page-objects/page-elements/home-page.json', 'manual-test-case-generator agent', today],

  // ========== NEGATIVE TEST CASES (6) ==========
  ['ELEC-016', 'Electronics', 'Search - Empty', 'Search with empty term from Electronics page', 'User is on Electronics category page', '1. Clear search input\n2. Click search button', 'Handles gracefully (shows all products or validation message)', 'Low', 'Not Executed', 'Negative', 'No', 'negative', 'REQ-SRCH-001', 'page-objects/page-elements/home-page.json', 'manual-test-case-generator agent', today],
  ['ELEC-017', 'Electronics', 'Search - Invalid Term', 'Search with invalid term returns no results', 'User is on Electronics category page', '1. Enter "xyzinvalid123" in search\n2. Click search button', 'No results message displayed', 'Medium', 'Not Executed', 'Negative', 'Candidate', 'negative,regression', 'REQ-SRCH-002', 'page-objects/page-elements/home-page.json', 'manual-test-case-generator agent', today],
  ['ELEC-018', 'Electronics', 'Add to Cart - Out of Stock', 'Add out of stock product to cart', 'User is on Electronics category page with out-of-stock product', '1. Click "Add to cart" on out-of-stock product', 'Appropriate error/notification shown (out of stock)', 'Medium', 'Not Executed', 'Negative', 'Candidate', 'negative', 'REQ-CART-002', 'page-objects/page-elements/electronics-page.json', 'manual-test-case-generator agent', today],
  ['ELEC-019', 'Electronics', 'Product Detail - Invalid Product', 'Access invalid/non-existent product URL', 'Browser is open', '1. Navigate to /electronics/invalid-product-999', '404 page or "Product not found" message', 'Low', 'Not Executed', 'Negative', 'No', 'negative', 'REQ-PROD-003', 'page-objects/page-elements/electronics-page.json', 'manual-test-case-generator agent', today],
  ['ELEC-020', 'Electronics', 'Sorting - Invalid Parameter', 'Access category with invalid sort parameter', 'Browser is open', '1. Navigate to /electronics?orderby=999', 'Defaults to valid sort or shows first page', 'Low', 'Not Executed', 'Negative', 'No', 'negative,security', 'REQ-SORT-005', 'page-objects/page-elements/electronics-page.json', 'manual-test-case-generator agent', today],
  ['ELEC-021', 'Electronics', 'Navigation - Back Button', 'Browser back button from product detail returns to category', 'User is on product detail page from Electronics', '1. Click browser back button', 'Returns to Electronics category page with previous state', 'Low', 'Not Executed', 'Negative', 'No', 'negative', 'REQ-NAV-007', 'page-objects/page-elements/electronics-page.json', 'manual-test-case-generator agent', today],

  // ========== BOUNDARY VALUE ANALYSIS (8) ==========
  ['ELEC-022', 'Electronics', 'Pagination - First Page', 'Verify first page loads correctly', 'User is on Electronics category page', '1. Verify page indicator shows page 1', 'Page 1 is active/default', 'Medium', 'Not Executed', 'Boundary', 'Candidate', 'boundary,regression', 'REQ-PAGE-002', 'page-objects/page-elements/electronics-page.json', 'manual-test-case-generator agent', today],
  ['ELEC-023', 'Electronics', 'Pagination - Last Page', 'Navigate to last page of products', 'User is on Electronics category page with pagination', '1. Click last page number\n2. Wait for page load', 'Last page loads with remaining products', 'Low', 'Not Executed', 'Boundary', 'Candidate', 'boundary', 'REQ-PAGE-003', 'page-objects/page-elements/electronics-page.json', 'manual-test-case-generator agent', today],
  ['ELEC-024', 'Electronics', 'Pagination - Beyond Last', 'Attempt to navigate beyond last page', 'User is on last page of Electronics category', '1. Click "Next" on last page', 'No navigation occurs or stays on last page', 'Low', 'Not Executed', 'Boundary', 'No', 'boundary', 'REQ-PAGE-004', 'page-objects/page-elements/electronics-page.json', 'manual-test-case-generator agent', today],
  ['ELEC-025', 'Electronics', 'Product Quantity - Min', 'Add product with quantity 1 (minimum)', 'User is on Electronics product detail page', '1. Set quantity to 1\n2. Click Add to cart', 'Product added to cart with quantity 1', 'Medium', 'Not Executed', 'Boundary', 'Yes', 'boundary,regression', 'REQ-QTY-001', 'page-objects/page-elements/electronics-page.json', 'manual-test-case-generator agent', today],
  ['ELEC-026', 'Electronics', 'Product Quantity - Max', 'Add product with maximum allowed quantity', 'User is on Electronics product detail page', '1. Set quantity to maximum (e.g., 10000)\n2. Click Add to cart', 'Handles max quantity (adds max allowed or shows validation)', 'Low', 'Not Executed', 'Boundary', 'Candidate', 'boundary', 'REQ-QTY-002', 'page-objects/page-elements/electronics-page.json', 'manual-test-case-generator agent', today],
  ['ELEC-027', 'Electronics', 'Product Quantity - Zero', 'Attempt to add product with quantity 0', 'User is on Electronics product detail page', '1. Set quantity to 0\n2. Click Add to cart', 'Validation error: "Quantity must be at least 1"', 'Medium', 'Not Executed', 'Boundary', 'Yes', 'boundary,negative', 'REQ-QTY-003', 'page-objects/page-elements/electronics-page.json', 'manual-test-case-generator agent', today],
  ['ELEC-028', 'Electronics', 'Product Quantity - Negative', 'Attempt to add product with negative quantity', 'User is on Electronics product detail page', '1. Set quantity to -1\n2. Click Add to cart', 'Validation error or defaults to 1', 'Low', 'Not Executed', 'Boundary', 'Candidate', 'boundary,negative', 'REQ-QTY-004', 'page-objects/page-elements/electronics-page.json', 'manual-test-case-generator agent', today],
  ['ELEC-029', 'Electronics', 'Product Quantity - Decimal', 'Attempt to add product with decimal quantity', 'User is on Electronics product detail page', '1. Set quantity to 1.5\n2. Click Add to cart', 'Validation error or rounds to integer', 'Low', 'Not Executed', 'Boundary', 'Candidate', 'boundary,negative', 'REQ-QTY-005', 'page-objects/page-elements/electronics-page.json', 'manual-test-case-generator agent', today],
];

// Create new worksheet
const ws = XLSX.utils.aoa_to_sheet(testCases);

// Set column widths for readability
ws['!cols'] = [
  { wch: 12 },   // TC ID
  { wch: 15 },   // Module
  { wch: 30 },   // Feature
  { wch: 50 },   // Scenario
  { wch: 40 },   // Preconditions
  { wch: 60 },   // Test Steps
  { wch: 55 },   // Expected Result
  { wch: 12 },   // Priority
  { wch: 15 },   // Status
  { wch: 12 },   // Type
  { wch: 12 },   // Automation
  { wch: 30 },   // Tags
  { wch: 20 },   // Requirements
  { wch: 40 },   // Source File
  { wch: 30 },   // Created By
  { wch: 15 }    // Created Date
];

// Add sheet to MASTER workbook
XLSX.utils.book_append_sheet(wb, ws, moduleName);

// Write file
XLSX.writeFile(wb, 'manual-test-cases/test-cases-auth.xlsx');
console.log(`✅ ${moduleName} sheet added to MASTER workbook (test-cases-auth.xlsx)`);
console.log(`📊 Total test cases: ${testCases.length - 1} (Positive: 15, Negative: 6, Boundary: 8)`);