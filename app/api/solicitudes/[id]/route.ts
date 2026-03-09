export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const authHeader = req.headers.get("authorization");
    const role = req.headers.get("role");
    const userId = req.headers.get("userid");

    if (!authHeader) {
      return NextResponse.json(
        { message: "No autorizado" },
        { status: 401 }
      );
    }

    const index = solicitudes.findIndex(
      (s) => s.id === id
    );

    if (index === -1) {
      return NextResponse.json(
        { message: "Solicitud no encontrada" },
        { status: 404 }
      );
    }

    const solicitud = solicitudes[index];

    // Usuario solo puede eliminar la suya
    if (role !== "admin" && solicitud.userId !== userId) {
      return NextResponse.json(
        { message: "Acceso prohibido" },
        { status: 403 }
      );
    }

    solicitudes.splice(index, 1);

    return NextResponse.json(
      { message: "Solicitud eliminada correctamente" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error al eliminar solicitud" },
      { status: 500 }
    );
  }
}