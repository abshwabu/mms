const fs = require('fs');
const path = require('path');

class UserStore {
  constructor(filename = 'data/users.json') {
    this.file = path.resolve(process.cwd(), filename);
    this._ensureFile();
    this.users = this._load();
  }

  _ensureFile() {
    const dir = path.dirname(this.file);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(this.file)) fs.writeFileSync(this.file, '[]', 'utf8');
  }

  _load() {
    try {
      const raw = fs.readFileSync(this.file, 'utf8');
      return JSON.parse(raw || '[]');
    } catch (err) {
      return [];
    }
  }

  _save() {
    fs.writeFileSync(this.file, JSON.stringify(this.users, null, 2), 'utf8');
  }

  create(user) {
    this.users.push(user);
    this._save();
    return user;
  }

  findByUsername(username) {
    return this.users.find(u => u.username === username);
  }

  findById(id) {
    return this.users.find(u => u.id === id);
  }

  all() {
    return this.users.slice();
  }
}

module.exports = UserStore;
