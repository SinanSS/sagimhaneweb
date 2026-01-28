import Database from 'better-sqlite3';
import { NextRequest } from 'next/server';
import path from 'path';

const ML_PER_PULSE = 100;

const DB_PATH = '/sutolcer/sutolcer_listener/db/sut_olcer_isletme.db';

interface ActiveMeasurement {
    kayit_id: number;
    hayvan_id: number;
    kupe_no: string;
    ozel_takip_numarasi: string | null;
    baslangic_zamani: string;
}

function getDb() {
    try {
        const db = new Database(DB_PATH, { readonly: true });
        db.pragma('journal_mode = WAL');
        return db;
    } catch (error) {
        console.error('❌ Database bağlantı hatası:', error);
        console.error('📁 Aranan path:', DB_PATH);
        throw error;
    }
}

function getActiveMeasurements(db: Database.Database): ActiveMeasurement[] {
    return db.prepare(`
    SELECT 
      som.kayit_id,
      som.hayvan_id,
      h.kupe_no,
      h.ozel_takip_numarasi,
      som.baslangic_zamani
    FROM hayvan_sut_olcumleri som
    JOIN hayvanlar h ON h.hayvan_id = som.hayvan_id
    WHERE som.bitis_zamani IS NULL
    ORDER BY som.baslangic_zamani DESC
  `).all() as ActiveMeasurement[];
}

function getPulseCount(db: Database.Database, id: number): number {
    const result = db.prepare(`
    SELECT COUNT(*) AS count
    FROM hayvan_sut_olcum_detaylari
    WHERE sut_olcum_id = ?
  `).get(id) as { count: number };

    return result.count;
}

export async function GET(request: NextRequest) {
    let db: Database.Database | null = null;

    try {
        db = getDb();

        const activeMeasurements = getActiveMeasurements(db);

        if (activeMeasurements.length === 0) {
            return Response.json({
                status: 'idle',
                measurements: []
            });
        }

        const measurements = activeMeasurements.map((active) => {
            const pulseCount = getPulseCount(db!, active.kayit_id);
            const litre = +(pulseCount * ML_PER_PULSE / 1000).toFixed(2);
            const startTime = new Date(active.baslangic_zamani).getTime();
            const sure = Math.floor((Date.now() - startTime) / 1000);

            return {
                kayitId: active.kayit_id,
                hayvanId: active.hayvan_id,
                kupeNo: active.kupe_no,
                ozelTakipNo: active.ozel_takip_numarasi || undefined,
                pulse: pulseCount,
                litre,
                sure,
                baslangic: active.baslangic_zamani
            };
        });

        return Response.json({
            status: 'active',
            measurements,
            debug: {
                dbPath: DB_PATH,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('❌ Database error:', error);
        return Response.json(
            {
                error: 'Database error',
                message: error instanceof Error ? error.message : 'Unknown error',
                dbPath: DB_PATH
            },
            { status: 500 }
        );
    } finally {
        if (db) {
            db.close();
        }
    }
}