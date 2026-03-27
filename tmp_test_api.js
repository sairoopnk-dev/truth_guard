async function test() {
  try {
    const res = await fetch('http://localhost:3001/api/fake-news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: 'NASA just confirmed that the Moon is actually made of green cheese and they have been hiding it since the Apollo missions.' })
    });
    const data = await res.json();
    console.log('STATUS:', res.status);
    console.log('DATA:', JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('ERROR:', e);
  }
}
test();
