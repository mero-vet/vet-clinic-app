import React, { useState } from 'react';
import { MdFormatBold, MdFormatItalic, MdFormatUnderlined, MdFormatListBulleted, MdFormatListNumbered, MdFormatAlignLeft, MdFormatAlignCenter, MdFormatAlignRight, MdImage, MdAttachFile } from 'react-icons/md';

const NoteEntryForm = ({ isVisible, onClose, onSave }) => {
  const [providerInitials, setProviderInitials] = useState('A');
  const [providerFullName, setProviderFullName] = useState('A Edrington');
  const [date, setDate] = useState('7/26/2025');
  const [time, setTime] = useState('3:57:09 PM');
  const [title, setTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [fontSize, setFontSize] = useState('9.75');
  const [fontFamily, setFontFamily] = useState('Arial');

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

  const providerInitialsList = providerData.map(p => p.initials);
  const providerFullNamesList = providerData.map(p => p.fullName);

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

  const handleProviderInitialsChange = (initials) => {
    setProviderInitials(initials);
    const provider = providerData.find(p => p.initials === initials);
    if (provider) {
      setProviderFullName(provider.fullName);
    }
  };

  const handleProviderFullNameChange = (fullName) => {
    setProviderFullName(fullName);
    const provider = providerData.find(p => p.fullName === fullName);
    if (provider) {
      setProviderInitials(provider.initials);
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
  };

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  if (!isVisible) return null;

  return (
    <div className="note-entry-form">
      {/* Form Header */}
      <div className="note-form-header">
        <div className="form-row">
          <div className="form-group">
            <label>Provider:</label>
            <div className="provider-dropdowns">
              <select 
                value={providerInitials} 
                onChange={(e) => handleProviderInitialsChange(e.target.value)}
                className="provider-initials-select"
              >
                {providerInitialsList.map(initials => (
                  <option key={initials} value={initials}>{initials}</option>
                ))}
              </select>
              <select 
                value={providerFullName} 
                onChange={(e) => handleProviderFullNameChange(e.target.value)}
                className="provider-fullname-select"
              >
                {providerFullNamesList.map(fullName => (
                  <option key={fullName} value={fullName}>{fullName}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label>Date/Time Performed:</label>
            <div className="datetime-group">
              <select 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="date-select"
              >
                <option value="7/26/2025">7/26/2025</option>
                <option value="7/25/2025">7/25/2025</option>
                <option value="7/24/2025">7/24/2025</option>
              </select>
              <select 
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="time-select"
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
            value={fontFamily}
            onChange={(e) => {
              setFontFamily(e.target.value);
              formatText('fontName', e.target.value);
            }}
            className="font-family-select"
          >
            {fontFamilies.map(font => (
              <option key={font} value={font}>{font}</option>
            ))}
          </select>

          <select 
            value={fontSize}
            onChange={(e) => {
              setFontSize(e.target.value);
              formatText('fontSize', e.target.value);
            }}
            className="font-size-select"
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
          <button className="action-btn exit-btn" onClick={onClose}>Exit</button>
        </div>
      </div>
    </div>
  );
};

export default NoteEntryForm; 