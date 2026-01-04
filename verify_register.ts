
async function main() {
  try {
    const response = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "New Author",
        email: "author_" + Date.now() + "@example.com",
        password: "securepassword123",
        role: "AUTHOR",
      }),
    });

    const data = await response.json();
    console.log("Status Code:", response.status);
    console.log("Response Body:", JSON.stringify(data, null, 2));

    if (response.status === 201 && data.id) {
      console.log("SUCCESS: User created with ID:", data.id);
    } else {
      console.log("FAILURE: Could not create user.");
    }
  } catch (error) {
    console.error("Error making request:", error);
  }
}

main();
