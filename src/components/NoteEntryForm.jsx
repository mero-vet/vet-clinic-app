import React, { useState, useEffect } from 'react';
import { MdFormatBold, MdFormatItalic, MdFormatUnderlined, MdFormatListBulleted, MdFormatListNumbered, MdFormatAlignLeft, MdFormatAlignCenter, MdFormatAlignRight, MdImage, MdAttachFile } from 'react-icons/md';

const NoteEntryForm = ({ isVisible, onClose, onSave }) => {
  const [providerInitials, setProviderInitials] = useState('');
  const [providerFullName, setProviderFullName] = useState('');
  const [date, setDate] = useState('7/26/2025');
  const [time, setTime] = useState('3:57:09 PM');
  const [title, setTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [fontSize, setFontSize] = useState('9.75');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [saveConfirmation, setSaveConfirmation] = useState('');

  const providerData = [
    { initials: 'A', fullName: 'A Edrington' },
    { initials: 'AF', fullName: 'Alexis Franklin' },
    { initials: 'CS', fullName: 'Camille Singleton, LVT' },
    { initials: 'EMM', fullName: 'Dr Betsy Marshall' },
    { initials: 'JR', fullName: 'Jahaira Reyes' },
    { initials: 'JO', fullName: 'Jessica Ols, LVT' },
    { initials: 'KF', fullName: 'Dr. Kim Fidler' },
    { initials: 'MN', fullName: 'Melody Nelson, LVT' },
    { initials: 'HF', fullName: 'Heather Foster' },
    { initials: 'RB', fullName: 'Robert Barnes, DVM' },
    { initials: 'SM', fullName: 'Sarah Mitchell' },
    { initials: 'TC', fullName: 'Thomas Chen, LVT' },
    { initials: 'LP', fullName: 'Linda Peterson' },
    { initials: 'MW', fullName: 'Mark Williams, DVM' }
  ];

  const providerInitialsList = ['', ...providerData.map(p => p.initials)];
  const providerFullNamesList = ['-- Select Provider --', ...providerData.map(p => p.fullName)];

  const fontFamilies = [
    'Arial',
    'Times New Roman',
    'Courier New',
    'Verdana',
    'Tahoma'
  ];

  const fontSizes = [
    '8', '9', '9.75', '10', '11', '12', '14', '16', '18', '20', '24'
  ];

  // Debug logging for dropdown values
  useEffect(() => {
    console.log('NoteEntryForm values:', {
      providerInitials: providerInitials || '(blank)',
      providerFullName: providerFullName || '(blank)',
      date,
      time,
      fontFamily,
      fontSize
    });
  }, [providerInitials, providerFullName, date, time, fontFamily, fontSize]);

  // Add a test to see if we can force Chrome to show the value
  useEffect(() => {
    if (isVisible) {
      const selects = document.querySelectorAll('.note-entry-form select');
      selects.forEach((select, index) => {
        console.log(`NoteForm Select ${index} value:`, select.value, 'displayed:', select.options[select.selectedIndex]?.text);
      });
    }
  });

  const handleProviderInitialsChange = (initials) => {
    setProviderInitials(initials);
    if (initials === '') {
      setProviderFullName('-- Select Provider --');
    } else {
      const provider = providerData.find(p => p.initials === initials);
      if (provider) {
        setProviderFullName(provider.fullName);
      }
    }
  };

  const handleProviderFullNameChange = (fullName) => {
    setProviderFullName(fullName);
    if (fullName === '-- Select Provider --') {
      setProviderInitials('');
    } else {
      const provider = providerData.find(p => p.fullName === fullName);
      if (provider) {
        setProviderInitials(provider.initials);
      }
    }
  };

  const handleSave = () => {
    const noteData = {
      providerInitials,
      providerFullName,
      date,
      time,
      title,
      content: noteContent,
      fontFamily,
      fontSize
    };
    onSave(noteData);

    // Show save confirmation and clear it after 3 seconds
    setSaveConfirmation('Note saved successfully!');
    setTimeout(() => {
      setSaveConfirmation('');
    }, 3000);
  };

  const handleExit = () => {
    // Save the note first, then close
    const noteData = {
      providerInitials,
      providerFullName,
      date,
      time,
      title,
      content: noteContent,
      fontFamily,
      fontSize
    };
    onSave(noteData);
    onClose();
  };

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  if (!isVisible) return null;

  return (
    <div className="note-entry-form">
      <style>
        {`
          .test-note-select {
            all: unset !important;
            color: black !important;
            background-color: white !important;
            border: 1px solid gray !important;
            padding: 2px !important;
            font-size: 11px !important;
            font-family: inherit !important;
            appearance: menulist !important;
            -webkit-appearance: menulist !important;
            -moz-appearance: menulist !important;
          }
        `}
      </style>
      {/* Form Header */}
      <div className="note-form-header">
        <div className="form-row">
          <div className="form-group">
            <label>Provider:</label>
            <div className="provider-dropdowns">
              <select
                key={`initials-${providerInitials || 'empty'}`}
                value={providerInitials}
                onChange={(e) => {
                  console.log('Provider initials changing from', providerInitials, 'to', e.target.value);
                  handleProviderInitialsChange(e.target.value);
                }}
                className="test-note-select"
              >
                {providerInitialsList.map((initials, index) => (
                  <option key={initials || `blank-${index}`} value={initials}>
                    {initials || '--'}
                  </option>
                ))}
              </select>
              <select
                key={`fullname-${providerFullName || 'empty'}`}
                value={providerFullName}
                onChange={(e) => {
                  console.log('Provider full name changing from', providerFullName, 'to', e.target.value);
                  handleProviderFullNameChange(e.target.value);
                }}
                className="test-note-select"
              >
                {providerFullNamesList.map((fullName, index) => (
                  <option key={fullName || `blank-fullname-${index}`} value={fullName}>
                    {fullName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Date/Time Performed:</label>
            <div className="datetime-group">
              <select
                key={`date-${date}`}
                value={date}
                onChange={(e) => {
                  console.log('Date changing from', date, 'to', e.target.value);
                  setDate(e.target.value);
                }}
                style={{
                  color: 'black',
                  backgroundColor: 'white',
                  border: '1px solid gray',
                  padding: '2px',
                  fontSize: '11px'
                }}
              >
                <option value="7/26/2025">7/26/2025</option>
                <option value="7/25/2025">7/25/2025</option>
                <option value="7/24/2025">7/24/2025</option>
              </select>
              <select
                key={`time-${time}`}
                value={time}
                onChange={(e) => {
                  console.log('Time changing from', time, 'to', e.target.value);
                  setTime(e.target.value);
                }}
                style={{
                  color: 'black',
                  backgroundColor: 'white',
                  border: '1px solid gray',
                  padding: '2px',
                  fontSize: '11px'
                }}
              >
                <option value="3:57:09 PM">3:57:09 PM</option>
                <option value="12:00:00 PM">12:00:00 PM</option>
                <option value="9:00:00 AM">9:00:00 AM</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group title-group">
            <label>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="title-input"
              placeholder=""
            />
          </div>
        </div>
      </div>

      {/* Rich Text Editor */}
      <div className="note-editor-section">
        <div className="editor-toolbar">
          <select
            key={`font-family-${fontFamily}`}
            value={fontFamily}
            onChange={(e) => {
              console.log('Font family changing from', fontFamily, 'to', e.target.value);
              setFontFamily(e.target.value);
              formatText('fontName', e.target.value);
            }}
            style={{
              color: 'black',
              backgroundColor: 'white',
              border: '1px solid gray',
              padding: '2px',
              fontSize: '11px'
            }}
          >
            {fontFamilies.map(font => (
              <option key={font} value={font}>{font}</option>
            ))}
          </select>

          <select
            key={`font-size-${fontSize}`}
            value={fontSize}
            onChange={(e) => {
              console.log('Font size changing from', fontSize, 'to', e.target.value);
              setFontSize(e.target.value);
              formatText('fontSize', e.target.value);
            }}
            style={{
              color: 'black',
              backgroundColor: 'white',
              border: '1px solid gray',
              padding: '2px',
              fontSize: '11px'
            }}
          >
            {fontSizes.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>

          <div className="toolbar-divider"></div>

          <button
            className="format-btn"
            onClick={() => formatText('bold')}
            title="Bold"
          >
            <MdFormatBold size={16} />
          </button>

          <button
            className="format-btn"
            onClick={() => formatText('italic')}
            title="Italic"
          >
            <MdFormatItalic size={16} />
          </button>

          <button
            className="format-btn"
            onClick={() => formatText('underline')}
            title="Underline"
          >
            <MdFormatUnderlined size={16} />
          </button>

          <div className="toolbar-divider"></div>

          <button
            className="format-btn"
            onClick={() => formatText('insertUnorderedList')}
            title="Bullet List"
          >
            <MdFormatListBulleted size={16} />
          </button>

          <button
            className="format-btn"
            onClick={() => formatText('insertOrderedList')}
            title="Numbered List"
          >
            <MdFormatListNumbered size={16} />
          </button>

          <div className="toolbar-divider"></div>

          <button
            className="format-btn"
            onClick={() => formatText('justifyLeft')}
            title="Align Left"
          >
            <MdFormatAlignLeft size={16} />
          </button>

          <button
            className="format-btn"
            onClick={() => formatText('justifyCenter')}
            title="Align Center"
          >
            <MdFormatAlignCenter size={16} />
          </button>

          <button
            className="format-btn"
            onClick={() => formatText('justifyRight')}
            title="Align Right"
          >
            <MdFormatAlignRight size={16} />
          </button>

          <div className="toolbar-divider"></div>

          <button className="format-btn" title="Insert Image">
            <MdImage size={16} />
          </button>

          <button className="format-btn" title="Attach File">
            <MdAttachFile size={16} />
          </button>

          <div className="toolbar-right">
            <span className="macro-text">MacroText</span>
            <span className="vet-notes">VetNotes</span>
          </div>
        </div>

        <div className="note-content">
          <label>Note:</label>
          <div
            className="rich-text-editor"
            contentEditable
            onInput={(e) => setNoteContent(e.target.innerHTML)}
            style={{
              fontFamily: fontFamily,
              fontSize: fontSize + 'pt'
            }}
          >
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="note-form-actions">
        <div className="bottom-tabs">
          <button className="bottom-tab">Problems and Diagnosis</button>
          <button className="bottom-tab">History</button>
          <button className="bottom-tab active">New Note</button>
        </div>

        <div className="action-buttons">
          <button className="action-btn save-btn" onClick={handleSave}>Save</button>
          <button className="action-btn preview-btn">Preview</button>
          <button className="action-btn email-btn">Email</button>
          <button className="action-btn lock-btn">Lock</button>
          <button className="action-btn exit-btn" onClick={handleExit}>Exit</button>
          {saveConfirmation && (
            <span className="save-confirmation" style={{
              marginLeft: '15px',
              color: 'green',
              fontWeight: 'bold',
              fontSize: '12px'
            }}>
              {saveConfirmation}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteEntryForm; 