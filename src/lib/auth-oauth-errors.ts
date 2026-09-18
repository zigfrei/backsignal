const oauthErrorKeys = {
  access_denied: 'cancelled',
  authorization_rejected: 'cancelled',
  email_not_found: 'emailMissing',
  account_not_linked: 'accountNotLinked',
  unable_to_link_account: 'accountNotLinked',
  email_does_not_match: 'emailMismatch',
  account_already_linked_to_different_user: 'alreadyLinked',
} as const;

export type OAuthErrorMessageKey =
  | (typeof oauthErrorKeys)[keyof typeof oauthErrorKeys]
  | 'default';

export function getOAuthErrorMessageKey(
  error?: string,
): OAuthErrorMessageKey | undefined {
  if (!error) {
    return undefined;
  }

  return oauthErrorKeys[error as keyof typeof oauthErrorKeys] ?? 'default';
}
