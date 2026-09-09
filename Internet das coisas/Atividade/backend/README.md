# clinic_backend
Backend with Node, Typescript and Prisma. For students with medical clinic context;

## Prisma

### Toda vez que mexemos no arquivo schema.prisma
```npx prisma format```

#### Ao atualizar qualquer model no schema.prisma, devemos:

```npx prisma migrate dev --name nome_alteracao```

## Toda vez que eu fizer alterações no banco e rodar migrations
```npx prisma generate```