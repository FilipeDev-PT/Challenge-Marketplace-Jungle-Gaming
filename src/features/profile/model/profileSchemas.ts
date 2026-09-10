import { z } from 'zod'
export const profileSchema = z.object({
  name: z.string().min(2, 'Informe o nome'),
  username: z.string().min(2, 'Informe o nome de usuário'),
  ens: z.string().min(1, 'Informe o nome ENS'),
  ensTld: z.string().default('.eth'),
  email: z.string().email('E-mail inválido'),
  walletNickname: z.string().min(2, 'Informe o apelido da carteira'),
  avatarUrl: z.string().nullable().optional(),
})
export const passwordSchema = z
  .object({
    currentPassword: z.string().optional().default(''),
    newPassword: z.string().optional().default(''),
    confirmPassword: z.string().optional().default(''),
  })
  .superRefine((values, ctx) => {
    const anyFilled =
      Boolean(values.currentPassword) ||
      Boolean(values.newPassword) ||
      Boolean(values.confirmPassword)
    if (!anyFilled) return
    if (!values.currentPassword) {
      ctx.addIssue({
        code: 'custom',
        path: ['currentPassword'],
        message: 'Informe a senha atual',
      })
    }
    if (!values.newPassword || values.newPassword.length < 8) {
      ctx.addIssue({
        code: 'custom',
        path: ['newPassword'],
        message: 'Nova senha deve ter ao menos 8 caracteres',
      })
    }
    if (values.newPassword !== values.confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'As senhas não coincidem',
      })
    }
  })
export type ProfileSchema = z.infer<typeof profileSchema>
export type PasswordSchema = z.infer<typeof passwordSchema>
