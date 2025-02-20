import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/_shadcn-ui/table";
import RenderList from "@/components/atoms/render-list";

interface Activity {
  id: number;
  username: string;
  judul: string;
  description: string;
  subject_type: string;
  event: string | null;
  causer_type: string;
  causer_id: number;
  created_at: string;
}

const ActivityTable = ({ activities }: { activities: Activity[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-0">#</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>Judul</TableHead>
          <TableHead>Deskripsi</TableHead>
          <TableHead>Dilakukan Pada</TableHead>
          {/* <TableHead>Subject Type</TableHead>
          <TableHead>Event</TableHead>
          <TableHead>Causer Type</TableHead>
          <TableHead>Causer ID</TableHead> */}
        </TableRow>
      </TableHeader>
      <TableBody>
        <RenderList
          of={activities}
          render={(activity, index: number) => (
            <TableRow key={activity.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{activity.username}</TableCell>
              <TableCell>{activity.judul}</TableCell>
              <TableCell>{activity.description}</TableCell>
              <TableCell>{activity.created_at}</TableCell>
              {/* <TableCell>{activity.subject_type}</TableCell> */}
              {/* <TableCell>{activity.event || "-"}</TableCell> */}
              {/* <TableCell>{activity.causer_type}</TableCell> */}
              {/* <TableCell>{activity.causer_id}</TableCell> */}
            </TableRow>
          )}
          renderFallback={() => (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                No data found
              </TableCell>
            </TableRow>
          )}
        />
      </TableBody>
    </Table>
  );
};

export default ActivityTable;
