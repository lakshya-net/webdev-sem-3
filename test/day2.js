// ============================================
// ASYNCHRONOUS PROGRAMMING IN JAVASCRIPT
// ============================================

// 1. CALLBACKS
// A function passed to another function to be executed later
console.log("=== CALLBACKS ===");
console.log("Callbacks are functions passed as arguments to other functions.\n");

// EXAMPLE 1: Simple Callback
console.log("--- EXAMPLE 1: Simple Callback ---");

function hello(callback) {
    console.log("Hello, world!");
    callback();
}

hello(function() {
    console.log("Callback executed");
});


// EXAMPLE 2: Callback with error handling
console.log("\n--- EXAMPLE 2: Callback with Error Handling ---");
function fetchUser(userId, successCallback, errorCallback) {
    setTimeout(() => {
        if (userId > 0) {
            successCallback({ id: userId, name: "Alice" });
        } else {
            errorCallback("Invalid user ID");
        }
    }, 800);
}

fetchUser(
    1,
    (user) => console.log("User fetched:", user),
    (error) => console.error("Error:", error)
);

// EXAMPLE 3: Array methods with callbacks
console.log("\n--- EXAMPLE 3: Array Methods (Higher-order functions) ---");
const numbers = [1, 2, 3, 4, 5];

// map - transform each element
const doubled = numbers.map((num) => num * 2);
console.log("Doubled:", doubled);

// filter - keep only elements that pass the test
const evenNumbers = numbers.filter((num) => num % 2 === 0);
console.log("Even numbers:", evenNumbers);

// forEach - execute callback for each element
console.log("For each number:");
numbers.forEach((num) => console.log("  -", num));

// EXAMPLE 4: Custom callback function
console.log("\n--- EXAMPLE 4: Custom Callback ---");
function processData(data, callback) {
    console.log("Processing data...");
    const processed = data.map(x => x * 2);
    callback(processed);
}

processData([10, 20, 30], (result) => {
    console.log("Result from callback:", result);
});

// EXAMPLE 5: setTimeout/setInterval callbacks
console.log("\n--- EXAMPLE 5: setTimeout/setInterval ---");
setTimeout(() => {
    console.log("This runs after 500ms");
}, 500);

let count = 0;
const intervalId = setInterval(() => {
    console.log("Counter:", count);
    count++;
    if (count >= 3) {
        clearInterval(intervalId);
    }
}, 400);

// EXAMPLE 6: Callback Hell (Pyramid of Doom) - Why we avoid this
console.log("\n--- EXAMPLE 6: Callback Hell (AVOID THIS) ---");
function getUser(id, callback) {
    setTimeout(() => {
        callback({ id, name: "User" + id });
    }, 300);
}

function getPosts(userId, callback) {
    setTimeout(() => {
        callback([{ id: 1, title: "Post 1" }, { id: 2, title: "Post 2" }]);
    }, 300);
}

function getComments(postId, callback) {
    setTimeout(() => {
        callback([{ id: 1, text: "Great!" }, { id: 2, text: "Nice!" }]);
    }, 300);
}

// Hard to read - deeply nested callbacks
getUser(1, (user) => {
    console.log("Got user:", user.name);
    getPosts(user.id, (posts) => {
        console.log("Got posts:", posts.length);
        getComments(posts[0].id, (comments) => {
            console.log("Got comments:", comments.length);
            // Hard to follow and maintain!
        });
    });
});

console.log("\n=== PROMISES ===");

// 2. PROMISES
// Better alternative to callbacks
// States: Pending → Fulfilled (resolved) or Rejected

const fetchUserPromise = (userId) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (userId > 0) {
                resolve({ id: userId, name: "Alice" });
            } else {
                reject("Invalid user ID");
            }
        }, 1500);
    });
};

// Using .then() and .catch()
fetchUserPromise(1)
    .then((user) => {
        console.log("Promise resolved:", user);
        return user.id; // Can chain promises
    })
    .then((id) => {
        console.log("User ID:", id);
    })
    .catch((error) => {
        console.error("Promise rejected:", error);
    })
    .finally(() => {
        console.log("Promise settled");
    });

console.log("\n=== ASYNC/AWAIT ===");

// 3. ASYNC/AWAIT
// Modern, cleaner syntax for working with promises
// Makes async code look synchronous

const fetchUserAsync = (userId) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (userId > 0) {
                resolve({ id: userId, name: "Bob" });
            } else {
                reject("Invalid user ID");
            }
        }, 1000);
    });
};

// async function always returns a promise




async function getUser() {
    try {
        const user = await fetchUserAsync(2);
        console.log("Async/await result:", user);
        return user;
    } catch (error) {
        console.error("Error:", error);
    }
}

getUser();









console.log("\n=== PROMISE.ALL ===");

// 4. PROMISE.ALL
// Wait for multiple promises to resolve

const promise1 = new Promise((resolve) =>
    setTimeout(() => resolve("Task 1 done"), 1000)
);
const promise2 = new Promise((resolve) =>
    setTimeout(() => resolve("Task 2 done"), 1500)
);
const promise3 = new Promise((resolve) =>
    setTimeout(() => resolve("Task 3 done"), 500)
);

Promise.all([promise1, promise2, promise3]).then((results) => {
    console.log("All promises resolved:", results);
});

console.log("\n=== PROMISE.RACE ===");

// 5. PROMISE.RACE
// Return as soon as first promise settles

Promise.race([promise1, promise2, promise3]).then((result) => {
    console.log("First promise settled:", result);
});

console.log("\n=== ASYNC FUNCTIONS WITH MULTIPLE AWAITS ===");

// 6. Multiple async operations
async function fetchMultipleUsers() {
    try {
        const user1 = await fetchUserAsync(1);
        console.log("Fetched:", user1.name);
        
        const user2 = await fetchUserAsync(2);
        console.log("Fetched:", user2.name);
        
        return [user1, user2];
    } catch (error) {
        console.error("Error fetching users:", error);
    }
}

fetchMultipleUsers();

console.log("\n=== FETCH API (Real-world example) ===");

// 7. Real-world example: Fetching data from an API
async function fetchGitHubUser(username) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`GitHub user ${username}:`, data.login, data.public_repos, "repos");
        return data;
    } catch (error) {
        console.error("Error fetching GitHub user:", error);
    }
}

// Uncomment to test (requires internet)
// fetchGitHubUser("torvalds");

console.log("\n=== SEQUENTIAL VS PARALLEL EXECUTION ===");

// Sequential: Wait for each to finish (slow)
async function sequentialExecution() {
    console.log("Sequential start");
    await fetchUserAsync(1);
    await fetchUserAsync(2);
    console.log("Sequential done");
}

// Parallel: Start all at once (fast)
async function parallelExecution() {
    console.log("Parallel start");
    await Promise.all([fetchUserAsync(1), fetchUserAsync(2)]);
    console.log("Parallel done");
}

// sequentialExecution();
// parallelExecution();

//event triggering loop

eventLoop = () => {
    console.log("\n=== EVENT LOOP DEMO ===");
    console.log("Start of event loop demo");
}

