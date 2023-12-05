
var uuid = require("uuid");

function parseId(id) {
  if (!id) return null;
  var atoms = id.split(".");
  if (atoms.length != 4) return null;
  var nid = atoms[0];
  var flag = parseInt(atoms[1]);
  var createTS = parseInt(atoms[2]);
  var expiryTS = parseInt(atoms[3]);
  if (uuid.validate(nid)
      && !isNaN(flag) && flag >= 0
      && !isNaN(createTS)
      && !isNaN(expiryTS)) {
        return [nid, flag, createTS, expiryTS];
  }
  return null;
}

class DomainId {
  
  constructor(domainId) {
    var parsed = parseId(domainId);
    this.valid = false;
    if (parsed && (parsed[1] == 0 || parsed[1] == 1) ) {
      this.valid = true;
      this.id = parsed[0];
      this.httpCookie = parsed[1];
      this.createTS = parsed[2];
      this.expiryTS = parsed[3];
    }
  }

  isValid() {
    return this.valid;
  }

  getId() {
    return (this.isValid()) ? this.id: null; 
  }

  isHttpCookie() {
    return (this.isValid()) ? (this.httpCookie == 1) : false;
  }

}

class NetworkId {

  constructor(nid) {
    var parsed = parseId(nid);
    this.valid = false;
    if ( parsed && (parsed[1] == 1 || parsed[1] == 3) ) {
      this.valid = true;
      this.id = parsed[0];
      this.supports3PC = (parsed[1] == 3);
      this.createTS = parsed[2];
      this.expiryTS = parsed[3];
    }
  }

  isValid() {
    return this.valid;
  }

  getId() {
    return (this.valid) ? this.id: null;
  }

}

exports.DomainId = DomainId;
exports.NetworkId = NetworkId;

