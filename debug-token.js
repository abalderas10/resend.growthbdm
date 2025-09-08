// Script para debuggear el token
const token = 'YWxiZXJ0by5iYWxkZXJhc0Bncm93dGhiZG0uY29tOm1pcGltLTIwMjYtbWV4aWNvOjE3NTcxMTg3OTQzOTA';

console.log('Token original:', token);

try {
  // Decodificar el token
  const decoded = Buffer.from(token, 'base64url').toString();
  console.log('Token decodificado:', decoded);
  
  const [email, eventId, timestamp] = decoded.split(':');
  console.log('Email:', email);
  console.log('Event ID:', eventId);
  console.log('Timestamp:', timestamp);
  console.log('Fecha del timestamp:', new Date(parseInt(timestamp)));
  
  // Verificar edad del token
  const tokenAge = Date.now() - parseInt(timestamp);
  const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 días
  const daysOld = tokenAge / (24 * 60 * 60 * 1000);
  
  console.log('Edad del token en días:', daysOld.toFixed(2));
  console.log('¿Token expirado?:', tokenAge > maxAge);
  
} catch (error) {
  console.error('Error al decodificar token:', error);
}