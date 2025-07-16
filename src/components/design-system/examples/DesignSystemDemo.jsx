import React, { useState } from 'react';
import { Button, Input, Card, Modal } from '../index';

const DesignSystemDemo = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setModalOpen(true);
    }, 1500);
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Design System Demo</h1>
      
      <section style={{ marginBottom: '40px' }}>
        <h2>Buttons</h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="tertiary">Tertiary</Button>
          <Button variant="danger">Danger</Button>
        </div>
        
        <h3>Sizes</h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
          <Button size="small">Small</Button>
          <Button size="medium">Medium</Button>
          <Button size="large">Large</Button>
        </div>
        
        <h3>States</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button disabled>Disabled</Button>
          <Button loading>Loading</Button>
          <Button fullWidth>Full Width</Button>
        </div>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>Inputs</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
          <Input
            label="Default Input"
            placeholder="Enter text..."
            helperText="This is helper text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          
          <Input
            label="Required Input"
            placeholder="Required field"
            required
          />
          
          <Input
            label="Error State"
            placeholder="Error example"
            error
            errorMessage="This field has an error"
          />
          
          <Input
            label="With Icon"
            placeholder="Search..."
            icon={<span>🔍</span>}
          />
          
          <Input
            label="Disabled"
            placeholder="Disabled input"
            disabled
          />
        </div>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>Cards</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <Card>
            <Card.Header>
              <h3 style={{ margin: 0 }}>Default Card</h3>
            </Card.Header>
            <Card.Body>
              This is a basic card with header, body, and footer sections.
            </Card.Body>
            <Card.Footer>
              <Button size="small" variant="secondary">Action</Button>
            </Card.Footer>
          </Card>
          
          <Card variant="elevated" shadow="medium">
            <h3>Elevated Card</h3>
            <p>This card has elevation and medium shadow.</p>
          </Card>
          
          <Card hoverable clickable onClick={() => alert('Card clicked!')}>
            <h3>Interactive Card</h3>
            <p>This card is hoverable and clickable.</p>
          </Card>
        </div>
      </section>

      <section>
        <h2>Modal</h2>
        <Button onClick={handleSubmit} loading={loading}>
          {loading ? 'Processing...' : 'Open Modal'}
        </Button>
        
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Example Modal"
          footer={
            <>
              <Button variant="secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setModalOpen(false)}>
                Confirm
              </Button>
            </>
          }
        >
          <p>This is an example modal dialog.</p>
          <p>Input value: {inputValue || 'No input provided'}</p>
        </Modal>
      </section>
    </div>
  );
};

export default DesignSystemDemo;