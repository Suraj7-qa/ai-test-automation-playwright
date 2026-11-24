const XLSX = require('xlsx');

// Read existing workbook
const wb = XLSX.readFile('manual-test-cases/authorization.xlsx');

// Electronics test cases
const testCases = [
  // Header columns
  ['TC_ID', 'Module', 'Feature', 'Test Scenario', 'Test Type', 'Preconditions', 'Test Steps', 'Test Data', 'Expected Result', 'Priority', 'Status'],

  // Positive Test Cases
  ['ELEC-001', 'Electronics', 'Category Navigation - Header', 'Navigate to Electronics category from header menu', 'Positive', 'User is on home page', '1. Click "Electronics" in header top menu\n2. Wait for page load', 'N/A', 'Electronics category page loads with title "Demo Web Shop. Electronics" and heading "Electronics"', 'Critical', 'Not Executed'],
  ['ELEC-002', 'Electronics', 'Category Navigation - Sidebar', 'Navigate to Electronics category from sidebar', 'Positive', 'User is on home page', '1. Click "Electronics" in sidebar category navigation\n2. Wait for page load', 'N/A', 'Electronics category page loads with title "Demo Web Shop. Electronics" and heading "Electronics"', 'Critical', 'Not Executed'],
  ['ELEC-003', 'Electronics', 'Category Navigation - Direct URL', 'Access Electronics category via direct URL', 'Positive', 'Browser is open', '1. Navigate to /electronics\n2. Wait for page load', 'URL: /electronics', 'Electronics category page loads with correct title and heading', 'High', 'Not Executed'],
  ['ELEC-004', 'Electronics', 'Product Listing', 'Verify products are displayed in Electronics category', 'Positive', 'User is on Electronics category page', '1. Observe product grid\n2. Verify product cards are visible', 'N/A', 'Product cards with name, price, and image are displayed', 'Critical', 'Not Executed'],
  ['ELEC-005', 'Electronics', 'Product Navigation', 'Click product navigates to product detail page', 'Positive', 'User is on Electronics category page with products visible', '1. Click on first product title link\n2. Wait for page load', 'N/A', 'Product detail page loads with product name, price, description, and add to cart button', 'Critical', 'Not Executed'],
  ['ELEC-006', 'Electronics', 'Sorting - Name A-Z', 'Sort products by Name A-Z', 'Positive', 'User is on Electronics category page', '1. Select "Name: A to Z" from sort dropdown\n2. Wait for page reload', 'Sort: Name: A to Z', 'Products reorder alphabetically ascending by name', 'Medium', 'Not Executed'],
  ['ELEC-007', 'Electronics', 'Sorting - Name Z-A', 'Sort products by Name Z-A', 'Positive', 'User is on Electronics category page', '1. Select "Name: Z to A" from sort dropdown\n2. Wait for page reload', 'Sort: Name: Z to A', 'Products reorder alphabetically descending by name', 'Medium', 'Not Executed'],
  ['ELEC-008', 'Electronics', 'Sorting - Price Low-High', 'Sort products by Price Low to High', 'Positive', 'User is on Electronics category page', '1. Select "Price: Low to High" from sort dropdown\n2. Wait for page reload', 'Sort: Price: Low to High', 'Products reorder by price ascending', 'Medium', 'Not Executed'],
  ['ELEC-009', 'Electronics', 'Sorting - Price High-Low', 'Sort products by Price High to Low', 'Positive', 'User is on Electronics category page', '1. Select "Price: High to Low" from sort dropdown\n2. Wait for page reload', 'Sort: Price: High to Low', 'Products reorder by price descending', 'Medium', 'Not Executed'],
  ['ELEC-010', 'Electronics', 'Pagination - Next Page', 'Navigate to next page of products (if applicable)', 'Positive', 'User is on Electronics category page with multiple pages', '1. Click "Next" pagination link\n2. Wait for page load', 'N/A', 'Second page of products loads with different products', 'Low', 'Not Executed'],
  ['ELEC-011', 'Electronics', 'Add to Cart from Category', 'Add product to cart from category page', 'Positive', 'User is on Electronics category page', '1. Click "Add to cart" on first product\n2. Verify notification', 'N/A', 'Success notification appears, cart count increments', 'Critical', 'Not Executed'],
  ['ELEC-012', 'Electronics', 'Add to Wishlist from Category', 'Add product to wishlist from category page', 'Positive', 'User is on Electronics category page', '1. Click "Add to wishlist" on first product\n2. Verify notification', 'N/A', 'Success notification appears, wishlist count increments', 'Medium', 'Not Executed'],
  ['ELEC-013', 'Electronics', 'Breadcrumb Navigation', 'Verify breadcrumbs on Electronics category page', 'Positive', 'User is on Electronics category page', '1. Observe breadcrumb trail', 'N/A', 'Breadcrumb shows: Home > Electronics', 'Medium', 'Not Executed'],
  ['ELEC-014', 'Electronics', 'Breadcrumb Click Home', 'Click Home in breadcrumb navigates to home page', 'Positive', 'User is on Electronics category page', '1. Click "Home" in breadcrumb\n2. Wait for page load', 'N/A', 'Navigates to home page (/)', 'Medium', 'Not Executed'],
  ['ELEC-015', 'Electronics', 'Cross-Category Navigation', 'Navigate from Electronics to another category', 'Positive', 'User is on Electronics category page', '1. Click "Computers" in header menu\n2. Wait for page load', 'N/A', 'Navigates to Computers category page', 'Medium', 'Not Executed'],

  // Negative Test Cases
  ['ELEC-016', 'Electronics', 'Search - Empty', 'Search with empty term from Electronics page', 'Negative', 'User is on Electronics category page', '1. Clear search input\n2. Click search button', 'Search term: ""', 'Handles gracefully (shows all products or validation message)', 'Low', 'Not Executed'],
  ['ELEC-017', 'Electronics', 'Search - Invalid Term', 'Search with invalid term returns no results', 'Negative', 'User is on Electronics category page', '1. Enter "xyzinvalid123" in search\n2. Click search button', 'Search term: "xyzinvalid123"', 'No results message displayed', 'Medium', 'Not Executed'],
  ['ELEC-018', 'Electronics', 'Add to Cart - Out of Stock', 'Add out of stock product to cart (if any)', 'Negative', 'User is on Electronics category page with out-of-stock product', '1. Click "Add to cart" on out-of-stock product', 'N/A', 'Appropriate error/notification shown (out of stock)', 'Medium', 'Not Executed'],
  ['ELEC-019', 'Electronics', 'Product Detail - Invalid Product', 'Access invalid/non-existent product URL', 'Negative', 'Browser is open', '1. Navigate to /electronics/invalid-product-999', 'URL: /electronics/invalid-product-999', '404 page or "Product not found" message', 'Low', 'Not Executed'],
  ['ELEC-020', 'Electronics', 'Sorting - Invalid Parameter', 'Access category with invalid sort parameter', 'Negative', 'Browser is open', '1. Navigate to /electronics?orderby=999', 'URL: /electronics?orderby=999', 'Defaults to valid sort or shows first page', 'Low', 'Not Executed'],
  ['ELEC-021', 'Electronics', 'Navigation - Back Button', 'Browser back button from product detail returns to category', 'Negative', 'User is on product detail page from Electronics', '1. Click browser back button', 'N/A', 'Returns to Electronics category page with previous state', 'Low', 'Not Executed'],

  // Boundary Value Analysis
  ['ELEC-022', 'Electronics', 'Pagination - First Page', 'Verify first page loads correctly', 'Boundary', 'User is on Electronics category page', '1. Verify page indicator shows page 1', 'N/A', 'Page 1 is active/default', 'Medium', 'Not Executed'],
  ['ELEC-023', 'Electronics', 'Pagination - Last Page', 'Navigate to last page of products (if pagination exists)', 'Boundary', 'User is on Electronics category page with pagination', '1. Click last page number\n2. Wait for page load', 'N/A', 'Last page loads with remaining products', 'Low', 'Not Executed'],
  ['ELEC-024', 'Electronics', 'Pagination - Beyond Last', 'Attempt to navigate beyond last page', 'Boundary', 'User is on last page of Electronics category', '1. Click "Next" on last page', 'N/A', 'No navigation occurs or stays on last page', 'Low', 'Not Executed'],
  ['ELEC-025', 'Electronics', 'Product Quantity - Min', 'Add product with quantity 1 (minimum)', 'Boundary', 'User is on Electronics product detail page', '1. Set quantity to 1\n2. Click Add to cart', 'Quantity: 1', 'Product added to cart with quantity 1', 'Medium', 'Not Executed'],
  ['ELEC-026', 'Electronics', 'Product Quantity - Max', 'Add product with maximum allowed quantity', 'Boundary', 'User is on Electronics product detail page', '1. Set quantity to maximum (e.g., 10000)\n2. Click Add to cart', 'Quantity: 10000', 'Handles max quantity (adds max allowed or shows validation)', 'Low', 'Not Executed'],
  ['ELEC-027', 'Electronics', 'Product Quantity - Zero', 'Attempt to add product with quantity 0', 'Boundary', 'User is on Electronics product detail page', '1. Set quantity to 0\n2. Click Add to cart', 'Quantity: 0', 'Validation error: "Quantity must be at least 1"', 'Medium', 'Not Executed'],
  ['ELEC-028', 'Electronics', 'Product Quantity - Negative', 'Attempt to add product with negative quantity', 'Boundary', 'User is on Electronics product detail page', '1. Set quantity to -1\n2. Click Add to cart', 'Quantity: -1', 'Validation error or defaults to 1', 'Low', 'Not Executed'],
  ['ELEC-029', 'Electronics', 'Product Quantity - Decimal', 'Attempt to add product with decimal quantity', 'Boundary', 'User is on Electronics product detail page', '1. Set quantity to 1.5\n2. Click Add to cart', 'Quantity: 1.5', 'Validation error or rounds to integer', 'Low', 'Not Executed'],
];

// Create new worksheet
const ws = XLSX.utils.aoa_to_sheet(testCases);

// Set column widths
const colWidths = [
  { wch: 12 },   // TC_ID
  { wch: 15 },   // Module
  { wch: 30 },   // Feature
  { wch: 50 },   // Test Scenario
  { wch: 15 },   // Test Type
  { wch: 40 },   // Preconditions
  { wch: 60 },   // Test Steps
  { wch: 35 },   // Test Data
  { wch: 55 },   // Expected Result
  { wch: 12 },   // Priority
  { wch: 15 }    // Status
];
ws['!cols'] = colWidths;

// Add sheet to workbook
XLSX.utils.book_append_sheet(wb, ws, 'Electronics');

// Write file
XLSX.writeFile(wb, 'manual-test-cases/authorization.xlsx');
console.log('Electronics sheet created with', testCases.length - 1, 'test cases');