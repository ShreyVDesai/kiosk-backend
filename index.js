// // // backend/index.js
// // const express = require('express');
// // const cors = require('cors');
// // const fs = require('fs');
// // const path = require('path');

// // const app = express();
// // const PORT = process.env.PORT || 3001;

// // // Middleware
// // app.use(cors());             // Enable CORS for all requests
// // app.use(express.json());     // Parse JSON request bodies

// // // GET /api/directory - returns the entire directory information
// // app.get('/api/directory', (req, res) => {
// //   const filePath = path.join(__dirname, 'Biology_Directory.json');
// //   fs.readFile(filePath, 'utf8', (err, data) => {
// //     if (err) {
// //       return res.status(500).json({ error: 'Failed to read directory data' });
// //     }
// //     const directoryData = JSON.parse(data);
// //     res.json(directoryData);
// //   });
// // });

// // // POST /api/directory - add a new entry to the directory
// // app.post('/api/directory', (req, res) => {
// //   const { category, entry } = req.body;  // Expecting category and entry object in request
// //   if (!category || !entry) {
// //     return res.status(400).json({ error: 'Category and entry data are required' });
// //   }
// //   const filePath = path.join(__dirname, 'Biology_Directory.json');
// //   fs.readFile(filePath, 'utf8', (err, data) => {
// //     if (err) {
// //       return res.status(500).json({ error: 'Failed to read directory data' });
// //     }
// //     const directoryData = JSON.parse(data);
// //     if (!directoryData[category]) {
// //       directoryData[category] = []; // create the category array if not exists
// //     }
// //     directoryData[category].push(entry);
// //     // Write the updated data back to the file
// //     fs.writeFile(filePath, JSON.stringify(directoryData, null, 2), (err) => {
// //       if (err) {
// //         return res.status(500).json({ error: 'Failed to save new entry' });
// //       }
// //       res.json({ message: 'Entry added successfully', entry });
// //     });
// //   });
// // });

// // // GET /api/config - get the current welcome message and email list
// // app.get('/api/config', (req, res) => {
// //   const configPath = path.join(__dirname, 'config.json');
// //   fs.readFile(configPath, 'utf8', (err, data) => {
// //     if (err) {
// //       return res.status(500).json({ error: 'Failed to read config' });
// //     }
// //     const config = JSON.parse(data);
// //     res.json(config);
// //   });
// // });

// // // POST /api/config - update welcome message and/or email recipients
// // app.post('/api/config', (req, res) => {
// //   const { welcomeMessage, helpRecipients } = req.body;
// //   const configPath = path.join(__dirname, 'config.json');
// //   fs.readFile(configPath, 'utf8', (err, data) => {
// //     if (err) {
// //       return res.status(500).json({ error: 'Failed to read config' });
// //     }
// //     let config = JSON.parse(data);
// //     if (welcomeMessage !== undefined) config.welcomeMessage = welcomeMessage;
// //     if (helpRecipients !== undefined) config.helpRecipients = helpRecipients;
// //     fs.writeFile(configPath, JSON.stringify(config, null, 2), (err) => {
// //       if (err) {
// //         return res.status(500).json({ error: 'Failed to update config' });
// //       }
// //       res.json({ message: 'Config updated', config });
// //     });
// //   });
// // });

// // // Start the server
// // app.listen(PORT, () => {
// //   console.log(`✅ Backend server is running on http://localhost:${PORT}`);
// // });

// // backend/index.js
// const express = require('express');
// const cors = require('cors');
// const fs = require('fs');
// const path = require('path');
// const multer = require('multer');

// const app = express();
// const PORT = process.env.PORT || 3001;

// // Ensure uploads directory exists
// const uploadDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// // Middleware
// app.use(cors());                  // Enable CORS for all routes
// app.use(express.json());          // Parse JSON bodies
// app.use('/uploads', express.static(uploadDir)); // Serve uploaded images

// // Multer setup for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadDir),
//   filename: (req, file, cb) => cb(null, file.originalname)
// });
// const upload = multer({ storage });

// /**  
//  * GET /api/directory  
//  * Returns entire Biology_Directory.json  
//  */
// app.get('/api/directory', (req, res) => {
//   const filePath = path.join(__dirname, 'Biology_Directory.json');
//   fs.readFile(filePath, 'utf8', (err, data) => {
//     if (err) return res.status(500).json({ error: 'Failed to read directory data' });
//     res.json(JSON.parse(data));
//   });
// });

// /**  
//  * POST /api/directory  
//  * Add a new entry  
//  * Body: { category: string, entry: object }  
//  */
// app.post('/api/directory', (req, res) => {
//   const { category, entry } = req.body;
//   if (!category || !entry) return res.status(400).json({ error: 'Category and entry required' });

//   const filePath = path.join(__dirname, 'Biology_Directory.json');
//   fs.readFile(filePath, 'utf8', (err, data) => {
//     if (err) return res.status(500).json({ error: 'Failed to read directory data' });
//     const directory = JSON.parse(data);
//     if (!directory[category]) directory[category] = [];
//     directory[category].push(entry);
//     fs.writeFile(filePath, JSON.stringify(directory, null, 2), err => {
//       if (err) return res.status(500).json({ error: 'Failed to save entry' });
//       res.json({ message: 'Entry added', entry });
//     });
//   });
// });

// /**  
//  * PUT /api/directory  
//  * Update an existing entry  
//  * Body: { category, name, lab?, room? }  
//  */
// app.put('/api/directory', (req, res) => {
//   const { category, name, lab, room } = req.body;
//   if (!category || !name) return res.status(400).json({ error: 'Category and name required' });

//   let directory;
//   try {
//     directory = JSON.parse(fs.readFileSync('Biology_Directory.json', 'utf8'));
//   } catch {
//     return res.status(500).json({ error: 'Failed to load directory' });
//   }
//   const entries = directory[category];
//   if (!entries) return res.status(404).json({ error: `Category "${category}" not found` });

//   const idx = entries.findIndex(e => e.name === name);
//   if (idx === -1) return res.status(404).json({ error: `Entry "${name}" not found` });

//   // Update fields
//   if (lab)  entries[idx].lab  = lab;
//   if (room) entries[idx].room = room;

//   try {
//     fs.writeFileSync('Biology_Directory.json', JSON.stringify(directory, null, 2));
//     res.json({ message: 'Entry updated', entry: entries[idx] });
//   } catch {
//     res.status(500).json({ error: 'Failed to save updated entry' });
//   }
// });

// /**  
//  * DELETE /api/directory  
//  * Remove an entry  
//  * Query params: category, name, lab?, room?  
//  */
// app.delete('/api/directory', (req, res) => {
//   const { category, name, lab, room } = req.query;
//   if (!category || !name) return res.status(400).json({ error: 'Category and name required' });

//   let directory;
//   try {
//     directory = JSON.parse(fs.readFileSync('Biology_Directory.json', 'utf8'));
//   } catch {
//     return res.status(500).json({ error: 'Failed to load directory' });
//   }
//   const entries = directory[category];
//   if (!entries) return res.status(404).json({ error: `Category "${category}" not found` });

//   const idx = entries.findIndex(e =>
//     e.name === name &&
//     (!lab  || e.lab  === lab) &&
//     (!room || e.room === room)
//   );
//   if (idx === -1) return res.status(404).json({ error: 'Matching entry not found' });

//   entries.splice(idx, 1);
//   try {
//     fs.writeFileSync('Biology_Directory.json', JSON.stringify(directory, null, 2));
//     res.json({ message: 'Entry deleted' });
//   } catch {
//     res.status(500).json({ error: 'Failed to save after deletion' });
//   }
// });

// /**  
//  * GET /api/config  
//  * Returns config.json (welcomeMessage, helpRecipients, imagePath)  
//  */
// app.get('/api/config', (req, res) => {
//   let config = {};
//   try {
//     config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
//   } catch {
//     // no config yet → send defaults
//   }
//   res.json(config);
// });

// /**  
//  * POST /api/config  
//  * Update welcomeMessage and/or helpRecipients  
//  * Body: { welcomeMessage?, helpRecipients? }  
//  */
// app.post('/api/config', (req, res) => {
//   const { welcomeMessage, helpRecipients } = req.body;
//   let config = {};
//   try {
//     config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
//   } catch { /* init new */ }

//   if (welcomeMessage  !== undefined) config.welcomeMessage  = welcomeMessage;
//   if (helpRecipients !== undefined) config.helpRecipients = helpRecipients;

//   try {
//     fs.writeFileSync('config.json', JSON.stringify(config, null, 2));
//     res.json({ message: 'Config updated', config });
//   } catch {
//     res.status(500).json({ error: 'Failed to save config' });
//   }
// });

// /**  
//  * POST /api/upload-image  
//  * Upload a single image file  
//  * Field name: "image"  
//  */
// app.post('/api/upload-image', upload.single('image'), (req, res) => {
//   if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

//   const filename = req.file.filename;
//   const filePath = path.join('uploads', filename);

//   // Load existing config
//   let config = {};
//   try {
//     config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
//   } catch { }

//   // Remove old image
//   if (config.imagePath && fs.existsSync(config.imagePath)) {
//     try { fs.unlinkSync(config.imagePath); } catch {}
//   }

//   // Update config with new path
//   config.imagePath = filePath;
//   try {
//     fs.writeFileSync('config.json', JSON.stringify(config, null, 2));
//     res.json({ message: 'Image uploaded', imagePath: filePath });
//   } catch {
//     res.status(500).json({ error: 'Uploaded but failed to update config' });
//   }
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`✅ Backend running on http://localhost:${PORT}`);
// });

// backend/index.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3001;

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadDir));

// Multer config for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename:    (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

/** Utility: read JSON from file */
function readJSON(file) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, file), 'utf8'));
}
/** Utility: write JSON to file */
function writeJSON(file, data) {
  fs.writeFileSync(path.join(__dirname, file), JSON.stringify(data, null, 2));
}

// ─── Directory Endpoints ─────────────────────────────────────────────────────

/** GET /api/directory → return all categories */
app.get('/api/directory', (req, res) => {
  try {
    const dir = readJSON('Biology_Directory.json');
    res.json(dir);
  } catch {
    res.status(500).json({ error: 'Could not load directory' });
  }
});

/** POST /api/directory → add a new entry */
app.post('/api/directory', (req, res) => {
  const { category, entry } = req.body;
  if (!category || !entry) return res.status(400).json({ error: 'Category & entry required' });

  try {
    const dir = readJSON('Biology_Directory.json');
    dir[category] = dir[category] || [];
    dir[category].push(entry);
    writeJSON('Biology_Directory.json', dir);
    res.json({ message: 'Added entry', entry });
  } catch {
    res.status(500).json({ error: 'Failed to add entry' });
  }
});

/** PUT /api/directory → edit an entry
 * Body: { category, find: { name, lab?, ext?, room? }, update: { name?, lab?, ext?, room? } }
 */
app.put('/api/directory', (req, res) => {
  const { category, find, update } = req.body;
  if (!category || !find || !find.name) {
    return res.status(400).json({ error: 'Category & find.name required' });
  }

  try {
    const dir = readJSON('Biology_Directory.json');
    const list = dir[category] || [];
    // find matching entry
    const idx = list.findIndex(e =>
      e.name  === find.name  &&
      (!find.lab  || e.lab  === find.lab)  &&
      (!find.ext  || e.ext  === find.ext)  &&
      (!find.room || e.room === find.room)
    );
    if (idx === -1) return res.status(404).json({ error: 'Entry not found' });

    // apply updates
    Object.assign(list[idx], update);
    writeJSON('Biology_Directory.json', dir);
    res.json({ message: 'Entry updated', entry: list[idx] });
  } catch {
    res.status(500).json({ error: 'Failed to update entry' });
  }
});


// app.delete('/api/directory', (req, res) => {
//   const { category, name, lab, ext, room } = req.query;
//   if (!category || !name) {
//     return res.status(400).json({ error: 'Category and name are required' });
//   }

//   // Load directory
//   let directory;
//   try {
//     directory = JSON.parse(fs.readFileSync('Biology_Directory.json', 'utf8'));
//   } catch {
//     return res.status(500).json({ error: 'Failed to load directory data' });
//   }

//   const entries = directory[category];
//   if (!entries) {
//     return res.status(404).json({ error: `Category "${category}" not found` });
//   }

//   // Figure out which key in each entry holds the "name" (e.g. "Grad Students", "Lab Personnel", "Faculty ", "Department Staff")
//   const sample = entries[0] || {};
//   const nameKey = Object.keys(sample)
//     .find(k => !['Lab', 'EXT', 'Room Number'].includes(k));
//   if (!nameKey) {
//     return res.status(500).json({ error: 'Could not determine the name field.' });
//   }

//   // Find the index of the entry where:
//   //  - entry[nameKey] === name
//   //  - if Lab exists, lab param matches
//   //  - if EXT exists, ext param matches
//   //  - if Room Number exists, room param matches
//   const idx = entries.findIndex(e => {
//     if (e[nameKey] !== name) return false;
//     if (sample.Lab       !== undefined && lab  && e.Lab        !== lab)  return false;
//     if (sample.EXT       !== undefined && ext  && String(e.EXT)  !== ext)  return false;
//     if (sample['Room Number'] !== undefined && room && e['Room Number'] !== room) return false;
//     return true;
//   });

//   if (idx === -1) {
//     return res.status(404).json({ error: 'Entry not found' });
//   }

//   // Remove it
//   entries.splice(idx, 1);

//   // Save file
//   try {
//     fs.writeFileSync(
//       path.join(__dirname, 'Biology_Directory.json'),
//       JSON.stringify(directory, null, 2)
//     );
//     return res.json({ message: 'Entry deleted successfully' });
//   } catch {
//     return res.status(500).json({ error: 'Failed to save after deletion' });
//   }
// });

// In backend/index.js, replace your existing DELETE /api/directory with:

// app.delete('/api/directory', (req, res) => {
//   const { category, name, lab, ext, room } = req.query;
//   if (!category || !name) {
//     return res.status(400).json({ error: 'Category and name are required' });
//   }

//   // 1) Load the directory
//   let dir;
//   try {
//     dir = JSON.parse(fs.readFileSync('Biology_Directory.json', 'utf8'));
//   } catch {
//     return res.status(500).json({ error: 'Could not read directory data' });
//   }

//   const list = dir[category];
//   if (!Array.isArray(list)) {
//     return res.status(404).json({ error: `Category "${category}" not found` });
//   }

//   // 2) Figure out which field holds the "name" in this category
//   //    (e.g. "Grad Students", "Lab Personnel ", "Labs", "Faculty ", "Department Staff")
//   const sample = list[0] || {};
//   const nameKey = Object.keys(sample)
//     .find(k => !['Lab','EXT','Room Number'].includes(k));
//   if (!nameKey) {
//     return res.status(500).json({ error: 'Unable to determine name field key' });
//   }

//   // 3) Try to find the matching entry
//   const idx = list.findIndex(e => {
//     // must match the name field exactly:
//     if (e[nameKey] !== name) return false;
//     // if this category has a Lab field, and the client sent lab,
//     // the lab must match:
//     if (sample.Lab !== undefined && lab && e.Lab !== lab) return false;
//     // if this category has an EXT field, and the client sent ext,
//     // those must match (cast to string in case number vs string):
//     if (sample.EXT !== undefined && ext && String(e.EXT) !== ext) return false;
//     // if the category has Room Number, and the client sent room,
//     // those must match:
//     if (sample['Room Number'] !== undefined && room && e['Room Number'] !== room) {
//       return false;
//     }
//     return true;
//   });

//   if (idx === -1) {
//     return res.status(404).json({ error: 'Entry not found' });
//   }

//   // 4) Remove it
//   list.splice(idx, 1);

//   // 5) Save back to file
//   try {
//     fs.writeFileSync(
//       path.join(__dirname, 'Biology_Directory.json'),
//       JSON.stringify(dir, null, 2)
//     );
//     return res.json({ message: 'Entry deleted successfully' });
//   } catch {
//     return res.status(500).json({ error: 'Failed to save after deletion' });
//   }
// });

// DELETE /api/directory → remove one entry by exact match
// app.delete('/api/directory', (req, res) => {
//   const { category, name, lab, ext, room } = req.query;
//   if (!category || !name) {
//     return res.status(400).json({ error: 'Category and name are required' });
//   }

//   // 1) Load the JSON
//   const filePath = path.join(__dirname, 'Biology_Directory.json');
//   let data;
//   try {
//     data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
//   } catch {
//     return res.status(500).json({ error: 'Could not read directory file' });
//   }

//   const list = data[category];
//   if (!Array.isArray(list)) {
//     return res.status(404).json({ error: `Category "${category}" not found` });
//   }

//   // 2) Filter out the matching entry
//   let filtered;
//   if (category === 'Labs') {
//     // Labs entries have keys: "Labs" and "Room Number"
//     filtered = list.filter(e =>
//       !(e.Labs === name && e['Room Number'] === room)
//     );
//   } else if (category === 'Lab Personnel' || category === 'Grad Students') {
//     // These entries have keys: category name, "Lab", and "Room Number"
//     filtered = list.filter(e =>
//       !(e[category] === name &&
//         e.Lab === lab &&
//         e['Room Number'] === room)
//     );
//   } else if (category === 'Faculty') {
//     // Faculty entries use "Faculty " (note trailing space), EXT, and "Room Number"
//     filtered = list.filter(e =>
//       !(e['Faculty '] === name &&
//         String(e.EXT) === ext &&
//         e['Room Number'] === room)
//     );
//   } else if (category === 'Staff') {
//     // Staff entries use "Department Staff", EXT, and "Room Number"
//     filtered = list.filter(e =>
//       !(e['Department Staff'] === name &&
//         String(e.EXT) === ext &&
//         e['Room Number'] === room)
//     );
//   } else {
//     // Fallback: exact match on whatever keys exist
//     filtered = list.filter(e => {
//       const matchName = e[nameKey] === name;
//       const matchLab  = !e.Lab || e.Lab === lab;
//       const matchExt  = !e.EXT || String(e.EXT) === ext;
//       const matchRoom = !e['Room Number'] || e['Room Number'] === room;
//       return !(matchName && matchLab && matchExt && matchRoom);
//     });
//   }

//   // 3) If nothing was removed, it's a 404
//   if (filtered.length === list.length) {
//     return res.status(404).json({ error: 'Entry not found' });
//   }

//   // 4) Save the updated list back
//   data[category] = filtered;
//   try {
//     fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
//     return res.json({ message: 'Entry deleted successfully' });
//   } catch {
//     return res.status(500).json({ error: 'Failed to save directory file' });
//   }
// });
// DELETE /api/directory → delete one entry exactly matching the provided fields
app.delete('/api/directory', (req, res) => {
  const { category, name, lab, ext, room } = req.query;
  if (!category || !name) {
    return res.status(400).json({ error: 'Category and name are required' });
  }
  
  const filePath = path.join(__dirname, 'Biology_Directory.json');
  let data;
  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return res.status(500).json({ error: 'Could not read directory file' });
  }

  const list = data[category];
  if (!Array.isArray(list)) {
    return res.status(404).json({ error: `Category "${category}" not found` });
  }

  let filtered;
  switch (category) {
    case 'Lab Personnel':
      // name key in JSON is "Lab Personnel " (with trailing space)
      filtered = list.filter(e =>
        !(e['Lab Personnel'] === name &&
          e.Lab === lab &&
          e['Room Number'] === room)
      );
      break;

    case 'Grad Students':
      // key is exactly "Grad Students"
      filtered = list.filter(e =>
        !(e['Grad Students'] === name &&
          e.Lab === lab &&
          e['Room Number'] === room)
      );
      break;

    case 'Faculty':
      // key is "Faculty " (trailing space), ext under EXT
      filtered = list.filter(e =>
        !(e["Faculty"] === name &&
          e["Room Number"] === room)
      );
      break;

    case 'Staff':
      // key is "Department Staff", ext under EXT
      filtered = list.filter(e =>
        !(e['Department Staff'] === name &&
          String(e.EXT) === ext &&
          e['Room Number'] === room)
      );
      break;

    case 'Labs':
      // key is "Labs", only room to match
      filtered = list.filter(e =>
        !(e["Labs"] === name &&
          e['Room Number'] === room)
      );
      break;

    default:
      return res.status(400).json({ error: `Unsupported category: ${category}` });
  }

  // If no entry was removed, it wasn’t found
  if (filtered.length === list.length) {
    return res.status(404).json({ error: 'Entry not found' });
  }

  // Write back the filtered list
  data[category] = filtered;
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return res.json({ message: 'Entry deleted successfully' });
  } catch {
    return res.status(500).json({ error: 'Failed to save directory file' });
  }
});




// ─── Config Endpoints ────────────────────────────────────────────────────────

/** GET /api/config → welcomeMessage, helpRecipients, imagePath */
app.get('/api/config', (req, res) => {
  let cfg = {};
  try { cfg = readJSON('config.json'); } catch {}
  res.json(cfg);
});

/** POST /api/config → update welcomeMessage and/or helpRecipients */
app.post('/api/config', (req, res) => {
  const { welcomeMessage, helpRecipients } = req.body;
  let cfg = {};
  try { cfg = readJSON('config.json'); } catch {}
  if (welcomeMessage  !== undefined) cfg.welcomeMessage  = welcomeMessage;
  if (helpRecipients !== undefined) cfg.helpRecipients = helpRecipients;
  try {
    writeJSON('config.json', cfg);
    res.json({ message: 'Config saved', config: cfg });
  } catch {
    res.status(500).json({ error: 'Failed to save config' });
  }
});

// ─── Image Upload Endpoint ──────────────────────────────────────────────────

/** POST /api/upload-image → upload single file field "image" */
app.post('/api/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  // update config.json with new imagePath
  let cfg = {};
  try { cfg = readJSON('config.json'); } catch {}
  // delete old image if exists
  if (cfg.imagePath && fs.existsSync(cfg.imagePath)) {
    try { fs.unlinkSync(cfg.imagePath); } catch {}
  }
  cfg.imagePath = '/uploads/' + req.file.filename;
  try {
    writeJSON('config.json', cfg);
    res.json({ message: 'Image uploaded', imagePath: cfg.imagePath });
  } catch {
    res.status(500).json({ error: 'Failed to update config with image' });
  }
});

// ─── Start ─────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`✅ Backend listening on http://localhost:${PORT}`);
});
