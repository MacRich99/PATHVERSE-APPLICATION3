export interface GoogleContact {
  resourceName: string;
  etag?: string;
  name: string;
  givenName?: string;
  familyName?: string;
  email?: string;
  phone?: string;
  organization?: string;
  jobTitle?: string;
  photoUrl?: string;
}

export const fetchGoogleContacts = async (accessToken: string): Promise<GoogleContact[]> => {
  const url = 'https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses,phoneNumbers,organizations,photos&pageSize=100';
  
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || `Failed to fetch contacts (${response.status})`);
  }

  const data = await response.json();
  const connections = data.connections || [];

  return connections.map((person: any) => {
    const primaryName = person.names?.[0];
    const primaryEmail = person.emailAddresses?.[0]?.value;
    const primaryPhone = person.phoneNumbers?.[0]?.value;
    const primaryOrg = person.organizations?.[0];
    const primaryPhoto = person.photos?.[0]?.url;

    return {
      resourceName: person.resourceName,
      etag: person.etag,
      name: primaryName?.displayName || `${primaryName?.givenName || ''} ${primaryName?.familyName || ''}`.trim() || 'Unnamed Contact',
      givenName: primaryName?.givenName,
      familyName: primaryName?.familyName,
      email: primaryEmail || '',
      phone: primaryPhone || '',
      organization: primaryOrg?.name || '',
      jobTitle: primaryOrg?.title || '',
      photoUrl: primaryPhoto || '',
    };
  });
};

export const createGoogleContact = async (
  accessToken: string,
  contactData: { givenName: string; familyName?: string; email?: string; phone?: string; organization?: string; jobTitle?: string }
): Promise<GoogleContact> => {
  const url = 'https://people.googleapis.com/v1/people:createContact';

  const bodyPayload: any = {
    names: [
      {
        givenName: contactData.givenName,
        familyName: contactData.familyName || '',
      },
    ],
  };

  if (contactData.email) {
    bodyPayload.emailAddresses = [{ value: contactData.email }];
  }

  if (contactData.phone) {
    bodyPayload.phoneNumbers = [{ value: contactData.phone }];
  }

  if (contactData.organization || contactData.jobTitle) {
    bodyPayload.organizations = [
      {
        name: contactData.organization || '',
        title: contactData.jobTitle || '',
      },
    ];
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bodyPayload),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'Failed to create Google Contact');
  }

  const person = await response.json();
  const primaryName = person.names?.[0];
  const primaryEmail = person.emailAddresses?.[0]?.value;
  const primaryPhone = person.phoneNumbers?.[0]?.value;
  const primaryOrg = person.organizations?.[0];

  return {
    resourceName: person.resourceName,
    etag: person.etag,
    name: primaryName?.displayName || `${contactData.givenName} ${contactData.familyName || ''}`.trim(),
    givenName: contactData.givenName,
    familyName: contactData.familyName,
    email: primaryEmail || contactData.email || '',
    phone: primaryPhone || contactData.phone || '',
    organization: primaryOrg?.name || contactData.organization || '',
    jobTitle: primaryOrg?.title || contactData.jobTitle || '',
  };
};

export const deleteGoogleContact = async (accessToken: string, resourceName: string): Promise<boolean> => {
  const url = `https://people.googleapis.com/v1/${resourceName}:deleteContact`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'Failed to delete contact');
  }

  return true;
};
