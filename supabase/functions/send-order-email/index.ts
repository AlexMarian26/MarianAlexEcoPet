import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    const { order, items, userEmail } = await req.json()

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "ECOPET Universe <onboarding@resend.dev>",
        to: [userEmail],
        subject: `✨ Bun venit în ECOPET Universe! Comanda #${String(order.id).slice(0, 5)}`,
        html: `
          <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: auto; border-radius: 32px; overflow: hidden; background-color: #ffffff; border: 1px solid #f0f4f8;">
            
            <div style="background: linear-gradient(135deg, #064e3b 0%, #022c22 100%); padding: 50px 20px; text-align: center;">
              <h1 style="color: #10b981; margin: 0; font-size: 32px; font-weight: 900; letter-spacing: 5px; font-style: italic; text-transform: uppercase;">ECOPET</h1>
              <h2 style="color: #ffffff; margin: 0; font-size: 14px; font-weight: 300; letter-spacing: 8px; text-transform: uppercase; opacity: 0.8;">Universe</h2>
            </div>

            <div style="padding: 40px;">
              <p style="color: #64748b; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Confirmare de recepție</p>
              <h3 style="color: #0f172a; font-size: 24px; margin: 0 0 20px 0;">Pregătim livrarea, ${order.nume}!</h3>
              
              <div style="background-color: #f0fdf4; border-radius: 24px; padding: 25px; margin-bottom: 30px;">
                <table style="width: 100%; border-collapse: collapse;">
                  ${items.map((i: any) => `
                    <tr>
                      <td style="padding: 10px 0;">
                        <img src="${i.imagine_url}" style="width: 60px; height: 60px; border-radius: 12px; object-fit: cover; border: 2px solid #ffffff;" />
                      </td>
                      <td style="padding: 0 15px; font-size: 14px; color: #064e3b; font-weight: 600;">
                        ${i.nume_produs} <br/>
                        <span style="font-size: 12px; color: #34d399; font-weight: 400;">Cantitate: ${i.cantitate}</span>
                      </td>
                    </tr>
                  `).join('')}
                </table>
              </div>

              <div style="border-top: 1px solid #f1f5f9; padding-top: 20px; display: flex; justify-content: space-between; align-items: center;">
                <div style="color: #64748b; font-size: 14px;">Total Plată (${order.metoda})</div>
                <div style="font-size: 24px; font-weight: 900; color: #059669;">${order.total.toFixed(2)} RON</div>
              </div>

              <div style="margin-top: 40px; padding: 20px; border-radius: 20px; border: 1px dashed #cbd5e1; text-align: center;">
                <p style="margin: 0; color: #64748b; font-size: 13px;">Livrare către: <strong>${order.adresa}, ${order.oras}</strong></p>
              </div>
            </div>

            <div style="background-color: #f8fafc; padding: 30px; text-align: center;">
                <p style="color: #94a3b8; font-size: 11px; margin: 0; line-height: 1.5;">Acest email a fost generat automat de ECOPET Universe.<br/>Vă mulțumim că susțineți sustenabilitatea.</p>
            </div>
          </div>
        `,
      }),
    })

    const data = await res.json()
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})