import { NextRequest, NextResponse } from 'next/server';

interface ConfirmAttendanceRequest {
  email: string;
  eventId: string;
  token: string;
}

interface AttendanceRecord {
  email: string;
  eventId: string;
  confirmedAt: string;
  ipAddress?: string;
  userAgent?: string;
}

// En una implementación real, esto se conectaría a una base de datos
const attendanceRecords: AttendanceRecord[] = [];

export async function POST(request: NextRequest) {
  try {
    const body: ConfirmAttendanceRequest = await request.json();
    const { email, eventId, token } = body;

    // Validar que todos los campos requeridos estén presentes
    if (!email || !eventId || !token) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: email, eventId, token' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Formato de email inválido' },
        { status: 400 }
      );
    }

    // Validar token
    try {
      const decoded = Buffer.from(token, 'base64url').toString();
      const [tokenEmail, tokenEventId, timestamp] = decoded.split(':');
      
      // Verificar que el token corresponda al email y evento
      if (tokenEmail !== email || tokenEventId !== eventId) {
        return NextResponse.json(
          { error: 'Token no válido para este email/evento' },
          { status: 401 }
        );
      }
      
      // Verificar que el token no sea muy antiguo (30 días)
      const tokenAge = Date.now() - parseInt(timestamp);
      const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 días en ms
      
      if (tokenAge > maxAge) {
        return NextResponse.json(
          { error: 'Token expirado' },
          { status: 401 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Token malformado' },
        { status: 401 }
      );
    }

    // Verificar si ya existe una confirmación para este email/evento
    const existingRecord = attendanceRecords.find(
      record => record.email === email && record.eventId === eventId
    );

    if (existingRecord) {
      return NextResponse.json(
        { 
          message: 'Asistencia ya confirmada previamente',
          confirmedAt: existingRecord.confirmedAt
        },
        { status: 200 }
      );
    }

    // Obtener información adicional de la request
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Crear nuevo registro de asistencia
    const newRecord: AttendanceRecord = {
      email,
      eventId,
      confirmedAt: new Date().toISOString(),
      ipAddress,
      userAgent
    };

    // Guardar el registro (en una implementación real, esto iría a la base de datos)
    attendanceRecords.push(newRecord);

    // Log para debugging (en producción, usar un logger apropiado)
    console.log('Nueva confirmación de asistencia:', {
      email,
      eventId,
      timestamp: newRecord.confirmedAt,
      ip: ipAddress
    });

    // Aquí podrías enviar un email de confirmación adicional
    // await sendConfirmationEmail(email, eventId);

    // Aquí podrías actualizar estadísticas en tiempo real
    // await updateEventStats(eventId);

    return NextResponse.json(
      {
        success: true,
        message: 'Asistencia confirmada exitosamente',
        confirmedAt: newRecord.confirmedAt,
        ticketId: `MIPIM-${Date.now().toString().slice(-6)}`
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error al confirmar asistencia:', error);
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        message: 'No se pudo procesar la confirmación de asistencia'
      },
      { status: 500 }
    );
  }
}

// Endpoint para obtener estadísticas de confirmaciones (opcional)
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const eventId = url.searchParams.get('eventId');

    if (!eventId) {
      return NextResponse.json(
        { error: 'eventId es requerido' },
        { status: 400 }
      );
    }

    const eventRecords = attendanceRecords.filter(
      record => record.eventId === eventId
    );

    const stats = {
      eventId,
      totalConfirmations: eventRecords.length,
      confirmationsByDay: eventRecords.reduce((acc, record) => {
        const date = record.confirmedAt.split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      latestConfirmations: eventRecords
        .sort((a, b) => new Date(b.confirmedAt).getTime() - new Date(a.confirmedAt).getTime())
        .slice(0, 10)
        .map(record => ({
          email: record.email.replace(/(.{2}).*(@.*)/, '$1***$2'), // Ofuscar email
          confirmedAt: record.confirmedAt
        }))
    };

    return NextResponse.json(stats, { status: 200 });

  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}