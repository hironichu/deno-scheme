console.log('Initiated....');
console.log('With arguments :');
console.log(Deno.args);
Deno.stdout.writeSync(new TextEncoder().encode('Hello World!\n'));
console.log('Waiting to be terminated ...');
// eslint-disable-next-line no-constant-condition
// while (true);