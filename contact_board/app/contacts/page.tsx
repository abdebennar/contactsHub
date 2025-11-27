import { mockApiClient } from "@/lib/mockApi";
import { ContactsClient } from "@/components/ContactsClient";
import { Building2 } from "lucide-react";

const DEPARTMENTS = ['Operations', 'Finance', 'HR', 'IT', 'Legal', 'Communications'];

interface ContactsPageProps {
  searchParams: {
    page?: string;
    search?: string;
    department?: string;
  };
}

const Contacts = async ({ searchParams }: ContactsPageProps) => {
  const page = parseInt(searchParams.page || '1');
  const search = searchParams.search || '';
  const department = searchParams.department || 'all';

  const data = await mockApiClient.getContacts({
    page,
    limit: 20,
    search,
    department: department === 'all' ? undefined : department
  });

  return (
    <ContactsClient 
      initialData={data}
      departments={DEPARTMENTS}
      initialPage={page}
      initialSearch={search}
      initialDepartment={department}
    />
  );
};

export default Contacts;