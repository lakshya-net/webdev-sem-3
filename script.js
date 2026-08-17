const fs = require('fs').promises;

async function main() {
	try {
		await fs.writeFile('student.txt', 'this is a test text');
		console.log('successfully created');

		const data = await fs.readFile('student.txt', 'utf8');
		console.log('file content:');
		console.log(data)
		await fs.appendFile('student.txt', '\nappended text');
		console.log('updated');
	} catch (err) {
		console.error('Error:', err.message);
		process.exit(1);
	}
}

main();