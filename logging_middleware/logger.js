function Log(stack, level, package, message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${stack}] [${level}] [${package}] ${message}`);
}

module.exports = { Log };
