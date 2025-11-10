// Test Script for Calendar Events API
// Run this after logging in to get a token

const API_URL = 'http://localhost:3000'; // Update based on your server port

// Replace with your actual token after logging in
const TEST_TOKEN = 'YOUR_JWT_TOKEN_HERE';

async function testEventAPIs() {
  console.log('🧪 Testing Calendar Events API...\n');

  // Test 1: Create Event
  console.log('1️⃣ Testing CREATE event...');
  try {
    const createResponse = await fetch(`${API_URL}/user/events`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Test Meeting',
        description: 'This is a test event',
        date: '2025-11-15',
        hour: '2pm',
        duration: '1h',
      }),
    });
    const createData = await createResponse.json();
    console.log('✅ CREATE Response:', createData);
    
    if (createData.success && createData.event) {
      const eventId = createData.event._id;
      
      // Test 2: Get All Events
      console.log('\n2️⃣ Testing GET all events...');
      const getAllResponse = await fetch(`${API_URL}/user/events`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${TEST_TOKEN}`,
        },
      });
      const getAllData = await getAllResponse.json();
      console.log('✅ GET ALL Response:', getAllData);
      
      // Test 3: Get Single Event
      console.log('\n3️⃣ Testing GET single event...');
      const getSingleResponse = await fetch(`${API_URL}/user/events/${eventId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${TEST_TOKEN}`,
        },
      });
      const getSingleData = await getSingleResponse.json();
      console.log('✅ GET SINGLE Response:', getSingleData);
      
      // Test 4: Update Event
      console.log('\n4️⃣ Testing UPDATE event...');
      const updateResponse = await fetch(`${API_URL}/user/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${TEST_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Test Meeting (Updated)',
          hour: '3pm',
        }),
      });
      const updateData = await updateResponse.json();
      console.log('✅ UPDATE Response:', updateData);
      
      // Test 5: Delete Event
      console.log('\n5️⃣ Testing DELETE event...');
      const deleteResponse = await fetch(`${API_URL}/user/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${TEST_TOKEN}`,
        },
      });
      const deleteData = await deleteResponse.json();
      console.log('✅ DELETE Response:', deleteData);
      
      console.log('\n🎉 All tests completed!');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Instructions
console.log('📋 INSTRUCTIONS:');
console.log('1. Make sure backend server is running');
console.log('2. Login to your app and get the JWT token from AsyncStorage');
console.log('3. Replace TEST_TOKEN with your actual token');
console.log('4. Run: node test_events.js\n');

// Uncomment the line below after setting your token
// testEventAPIs();
