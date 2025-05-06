// document.addEventListener('DOMContentLoaded', () => {
//     const countCtl = document.getElementById('count');
//     const distCtl  = document.getElementById('dist');
//     const linesCtl = document.getElementById('lines');
//     const applyBtn = document.getElementById('apply');
//     const countVal = document.getElementById('count-val');
//     const distVal  = document.getElementById('dist-val');
  
//     // Load saved preferences or use defaults
//     chrome.storage.sync.get(
//       { count: 300, dist: 120, lines: true },
//       prefs => {
//         countCtl.value   = prefs.count;
//         distCtl.value    = prefs.dist;
//         linesCtl.checked = prefs.lines;
//         countVal.textContent = prefs.count;
//         distVal.textContent  = prefs.dist;
//       }
//     );
  
//     // Live update labels
//     countCtl.addEventListener('input', e => countVal.textContent = e.target.value);
//     distCtl.addEventListener('input',  e => distVal.textContent  = e.target.value);
  
//     // Apply button: save prefs and notify
//     applyBtn.addEventListener('click', () => {
//       const newPrefs = {
//         count: Number(countCtl.value),
//         dist:  Number(distCtl.value),
//         lines: linesCtl.checked
//       };
//       chrome.storage.sync.set(newPrefs, () => {
//         chrome.runtime.sendMessage({
//           type: 'updateSettings',
//           settings: newPrefs
//         });
//       });
//     });
//   });
  
document.addEventListener('DOMContentLoaded', () => {
  const countCtl = document.getElementById('count');
  const distCtl  = document.getElementById('dist');
  const speedCtl = document.getElementById('speed');
  const linesCtl = document.getElementById('lines');
  const applyBtn = document.getElementById('apply');
  const countVal = document.getElementById('count-val');
  const distVal  = document.getElementById('dist-val');
  const speedVal = document.getElementById('speed-val');

  chrome.storage.sync.get(
    { count:300, dist:120, speed:1, lines:true },
    prefs => {
      countCtl.value   = prefs.count;
      distCtl.value    = prefs.dist;
      speedCtl.value   = prefs.speed;
      linesCtl.checked = prefs.lines;
      countVal.textContent = prefs.count;
      distVal.textContent  = prefs.dist;
      speedVal.textContent = prefs.speed.toFixed(1);
    }
  );

  countCtl.addEventListener('input', e => countVal.textContent = e.target.value);
  distCtl.addEventListener('input',  e => distVal.textContent  = e.target.value);
  speedCtl.addEventListener('input', e => speedVal.textContent = parseFloat(e.target.value).toFixed(1));

  applyBtn.addEventListener('click', () => {
    const newPrefs = {
      count: Number(countCtl.value),
      dist:  Number(distCtl.value),
      speed: Number(speedCtl.value),
      lines: linesCtl.checked
    };
    chrome.storage.sync.set(newPrefs, () => {
      chrome.runtime.sendMessage({ type:'updateSettings', settings:newPrefs });
    });
  });
});