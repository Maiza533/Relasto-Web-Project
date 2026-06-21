function MapComponent({ address, city, country }) {
  const locationQuery = `${address || ""}, ${city || ""}, ${country || "UK"}`;
  const encodedLocation = encodeURIComponent(locationQuery);

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <iframe
        src={`https://maps.google.com/maps?q=${encodedLocation}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
        width="100%"
        height="100%"
        style={{ border: 0, borderRadius: '8px' }}
        title="Property Location Map"
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '8px',
        borderRadius: '4px',
        fontSize: '12px',
        color: '#333'
      }}>
        📍 {locationQuery}
      </div>
    </div>
  );
}

export default MapComponent;