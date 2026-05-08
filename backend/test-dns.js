const dns = require('dns');

const domain = '_mongodb._tcp.cluster0.8dcjbcy.mongodb.net';

console.log(`Resolving SRV for ${domain}...`);

dns.resolveSrv(domain, (err, addresses) => {
  if (err) {
    console.error('Error resolving SRV:', err);
  } else {
    console.log('SRV records:', addresses);
  }
});
