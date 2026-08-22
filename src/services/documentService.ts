import type { AppDocument } from '../types/document';

let MOCK_DOCUMENTS: AppDocument[] = [
  {
    id: 'doc-001',
    employeeId: 'EMP001',
    employeeName: 'Sarah Jenkins',
    name: 'Offer_Letter.pdf',
    type: 'application/pdf',
    size: 204800,
    uploadDate: '2025-01-15T10:00:00Z',
    url: '#',
  },
  {
    id: 'doc-002',
    employeeId: 'EMP001',
    employeeName: 'Sarah Jenkins',
    name: 'ID_Proof.jpg',
    type: 'image/jpeg',
    size: 512000,
    uploadDate: '2025-01-16T11:30:00Z',
    url: '#',
  },
  {
    id: 'doc-003',
    employeeId: 'EMP002',
    employeeName: 'Michael Chen',
    name: 'Degree_Certificate.pdf',
    type: 'application/pdf',
    size: 1024000,
    uploadDate: '2025-02-10T09:15:00Z',
    url: '#',
  }
];

export const documentService = {
  async getEmployeeDocuments(employeeId: string): Promise<AppDocument[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_DOCUMENTS.filter(d => d.employeeId === employeeId));
      }, 300);
    });
  },

  async getAllDocuments(): Promise<AppDocument[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_DOCUMENTS), 400);
    });
  },

  async uploadDocument(employeeId: string, employeeName: string, file: File): Promise<AppDocument> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newDoc: AppDocument = {
          id: `doc-${Date.now()}`,
          employeeId,
          employeeName,
          name: file.name,
          type: file.type,
          size: file.size,
          uploadDate: new Date().toISOString(),
          url: '#' // Mock URL
        };
        MOCK_DOCUMENTS = [newDoc, ...MOCK_DOCUMENTS];
        resolve(newDoc);
      }, 600);
    });
  },

  async deleteDocument(docId: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        MOCK_DOCUMENTS = MOCK_DOCUMENTS.filter(d => d.id !== docId);
        resolve();
      }, 400);
    });
  }
};
