exports.accountVerifiedTemplate = (fullName) => `
  <div style="font-family: Arial, sans-serif; background-color: #f7fafc; padding: 30px;">
    <table width="100%" style="max-width: 500px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">
      <tr>
        <td style="padding: 32px 32px 16px 32px; text-align: center;">
          <img src="https://i.ibb.co/Y0Lh5bH/gajanan-logo.png" alt="Gajanan Skill Tech" width="70" style="margin-bottom: 16px;" />
          <h2 style="color: #1a237e; margin: 0;">Congratulations, ${fullName}!</h2>
        </td>
      </tr>
      <tr>
        <td style="padding: 0 32px 32px 32px; color: #444; text-align: center;">
          <p style="font-size: 18px;">Your account has been <b style="color:#28a745;">verified</b> by our admin team.</p>
          <p style="font-size: 16px; margin-top: 16px;">
            You now have access to all the features of <b>Gajanan Skill Tech</b>.<br/>
            We are excited to have you as a part of our community!
          </p>
        </td>
      </tr>
      <tr>
        <td style="text-align: center; padding: 24px 32px 16px 32px; color: #888; font-size: 13px;">
          If you have questions, reach us at <a href="mailto:support@gajananskilltech.com" style="color:#1a237e;">support@gajananskilltech.com</a>
        </td>
      </tr>
      <tr>
        <td style="text-align: center; color: #ccc; font-size: 12px; padding-bottom: 16px;">
          &copy; ${new Date().getFullYear()} Gajanan Skill Tech. All rights reserved.
        </td>
      </tr>
    </table>
  </div>
`;