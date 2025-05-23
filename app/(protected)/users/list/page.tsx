import { Metadata } from 'next';
import ClientUserList from './client-user-list';
import { USER_LIST } from '@/app/graphql/User';
import { defaultPageSize } from '@/app/common/Configuration';
import { createServerApolloClient } from '@/app/common/utility';
import UserDTO from '@/app/types/UserDTO';
export const metadata: Metadata = {
  title: 'Users'
};

export const revalidate = 0;

export default async function UserListPage() {
  let arrUserDTO: UserDTO[] = [];
  let total_records: number = 0;
  try {
    const apolloClient = await createServerApolloClient();
    const result = apolloClient.query({
      query: USER_LIST,
      variables: {
        filter_text: '',
        sort_field: 'id',
        sort_direction: 'desc',
        offset: 0,
        limit: defaultPageSize
      }
    });
    const results = await Promise.all([result]);
    if (results[0]?.data?.getUserList?.users) {
      arrUserDTO = results[0].data.getUserList.users;
    }
    if (results[0]?.data?.getUserList?.total_records) {
      total_records = results[0].data.getUserList.total_records;
    }
  } catch {}
  return <ClientUserList arrUserDTO={arrUserDTO} total_records={total_records}></ClientUserList>;
}
